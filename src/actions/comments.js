import { omit } from 'lodash';
import api from '../api';
import graphql from '../api/graphql';
import loader from '../utils/loader';
import { addServerErrorNotification } from './notifications';
import { addUsers, getOwnerCredentialsOrShowAuthPopup } from './users';
import { searchTags } from '../utils/text';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';
import { selectCommentById, selectPostById, selectOrgById } from '../store';
import Worker from '../worker';

export const addComments = comments => (dispatch) => {
  const users = [];

  comments.forEach((comment) => {
    if (comment.user) {
      users.push(comment.user);
      comment.user = comment.user.id;
      comment.isNew = comment.isNew || false;
    }
  });

  dispatch(addUsers(users));
  dispatch({ type: 'ADD_COMMENTS', payload: comments });
};

export const commentsResetContainerDataByEntryId = ({
  containerId,
  entryId,
}) => ({
  type: 'COMMENTS_RESET_CONTAINER_DATA_BY_ENTRY_ID',
  payload: {
    containerId,
    entryId,
  },
});

export const commentsResetContainerDataById = ({
  containerId,
}) => ({
  type: 'COMMENTS_RESET_CONTAINER_DATA_BY_ID',
  payload: {
    containerId,
  },
});

export const commentsAddContainerData = ({
  containerId,
  entryId,
  parentId,
  comments,
  metadata,
}) => (dispatch) => {
  dispatch(addComments(comments));
  dispatch({
    type: 'COMMENTS_ADD_CONTAINER_DATA',
    payload: {
      containerId,
      entryId,
      parentId,
      metadata,
      commentIds: comments.map(i => i.id),
    },
  });
};

export const getPostComments = ({
  containerId,
  postId,
  page,
  perPage,
}) => async (dispatch) => {
  loader.start();
  try {
    const data = await graphql.getPostComments({
      page,
      perPage,
      commentableId: postId,
    });
    dispatch(commentsAddContainerData({
      containerId,
      entryId: postId,
      parentId: 0,
      comments: data.data,
      metadata: data.metadata,
    }));
  } catch (e) {
    console.error(e);
    dispatch(addServerErrorNotification(e));
  }
  loader.done();
};

export const getCommentsOnComment = ({
  containerId,
  commentableId,
  parentId,
  parentDepth,
  page,
  perPage,
}) => async (dispatch) => {
  loader.start();
  try {
    const data = await graphql.getCommentsOnComment({
      commentableId,
      parentId,
      parentDepth,
      page,
      perPage,
    });

    dispatch(commentsAddContainerData({
      containerId,
      entryId: commentableId,
      parentId,
      metadata: data.metadata,
      comments: data.data,
    }));
  } catch (e) {
    console.error(e);
    dispatch(addServerErrorNotification(e));
  }
  loader.done();
};

// TODO: Refactoring like updateComment
export const createComment = (
  ownerId,
  ownerAccountName,
  ownerPrivateKey,
  postId,
  postBlockchainId,
  containerId,
  data,
  commentId,
  commentBlockchainId,
  orgBlockchainId,
) => async (dispatch) => {
  const commentContent = {
    description: data.description,
    entity_images: data.entityImages,
    entity_tags: searchTags(data.description),
  };
  let signed_transaction;
  let blockchain_id;

  if (orgBlockchainId && !commentBlockchainId) {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateCommentFromOrganization(
      ownerAccountName,
      ownerPrivateKey,
      postBlockchainId,
      orgBlockchainId,
      commentContent,
      false,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  } else if (orgBlockchainId && commentBlockchainId) {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateCommentFromOrganization(
      ownerAccountName,
      ownerPrivateKey,
      commentBlockchainId,
      orgBlockchainId,
      commentContent,
      true,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  } else if (commentBlockchainId) {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateCommentFromUser(
      ownerAccountName,
      ownerPrivateKey,
      commentBlockchainId,
      commentContent,
      true,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  } else {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateCommentFromUser(
      ownerAccountName,
      ownerPrivateKey,
      postBlockchainId,
      commentContent,
      false,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  }

  const comment = await api.createComment(
    {
      ...omit(commentContent, ['entity_tags']),
      signed_transaction: JSON.stringify(signed_transaction),
      blockchain_id,
    },
    postId,
    commentId,
  );

  dispatch(commentsAddContainerData({
    containerId,
    entryId: postId,
    comments: [{ ...comment, isNew: true }],
  }));

  return comment;
};

export const updateComment = (
  commentId,
  commentData,
) => async (dispatch, getState) => {
  const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

  if (!ownerCredentials) {
    return;
  }

  const state = getState();
  const comment = selectCommentById(commentId)(state);

  if (!comment) {
    throw new Error('Comment not found.');
  }

  const post = selectPostById(comment.commentableId)(state);

  if (!post) {
    throw new Error('Post not found.');
  }

  let parentComment;

  if (comment.parentId) {
    parentComment = selectCommentById(comment.parentId)(state);
  }

  if (comment.parentId && !parentComment) {
    throw new Error('Parent comment not found.');
  }

  let org;

  if (post.organizationId) {
    org = selectOrgById(post.organizationId)(state);
  }

  if (post.organizationId && !org) {
    throw new Error('Organization not found.');
  }

  const commentContent = {
    description: commentData.description,
    entity_images: commentData.entityImages,
    entity_tags: searchTags(commentData.description),
  };

  let signed_transaction;

  if (!org) {
    signed_transaction = await Worker.signUpdateCommentFromAccount(
      ownerCredentials.accountName,
      ownerCredentials.socialKey,
      parentComment ? parentComment.blockchainId : post.blockchainId,
      commentContent,
      comment.blockchainId,
      !!parentComment,
      TRANSACTION_PERMISSION_SOCIAL,
    );
  } else {
    signed_transaction = await Worker.signUpdateCommentFromOrganization(
      ownerCredentials.accountName,
      ownerCredentials.socialKey,
      parentComment ? parentComment.blockchainId : post.blockchainId,
      org.blockchainId,
      commentContent,
      comment.blockchainId,
      !!parentComment,
      TRANSACTION_PERMISSION_SOCIAL,
    );
  }

  const data = {
    ...omit(commentContent, ['entity_tags']),
    signed_transaction: JSON.stringify(signed_transaction),
  };

  const result = await api.updateComment(data, commentId);

  dispatch(addComments([result]));
};
