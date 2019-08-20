import { omit } from 'lodash';
import Wallet from 'ucom-libs-wallet';
import api from '../api';
import graphql from '../api/graphql';
import loader from '../utils/loader';
import { addServerErrorNotification } from './notifications';
import { addUsers } from './users';
import { searchTags } from '../utils/text';

const { PublicationsApi } = Wallet.Content;

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
  try {
    const commentContent = {
      description: data.description,
      entity_images: data.entityImages,
      entity_tags: searchTags(data.description),
    };
    let signed_transaction;
    let blockchain_id;

    if (orgBlockchainId && !commentBlockchainId) {
      ({ signed_transaction, blockchain_id } = await PublicationsApi.signCreateCommentFromOrganization(
        ownerAccountName,
        ownerPrivateKey,
        postBlockchainId,
        orgBlockchainId,
        commentContent,
        false,
      ));
    } else if (orgBlockchainId && commentBlockchainId) {
      ({ signed_transaction, blockchain_id } = await PublicationsApi.signCreateCommentFromOrganization(
        ownerAccountName,
        ownerPrivateKey,
        commentBlockchainId,
        orgBlockchainId,
        commentContent,
        true,
      ));
    } else if (commentBlockchainId) {
      ({ signed_transaction, blockchain_id } = await PublicationsApi.signCreateCommentFromUser(
        ownerAccountName,
        ownerPrivateKey,
        commentBlockchainId,
        commentContent,
        true,
      ));
    } else {
      ({ signed_transaction, blockchain_id } = await PublicationsApi.signCreateCommentFromUser(
        ownerAccountName,
        ownerPrivateKey,
        postBlockchainId,
        commentContent,
        false,
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
  } catch (err) {
    throw err;
  }
};
