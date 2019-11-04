import { omit } from 'lodash';
import api, { graphql } from '../api';
import { addUsers } from './users';
import { addOrganizations } from './organizations';
import multiSignActions from './multiSign';
import { POST_TYPE_MEDIA_ID, TRANSACTION_PERMISSION_SOCIAL } from '../utils';
import { commentsAddContainerData } from './comments';
import { COMMENTS_CONTAINER_ID_POST } from '../utils/comments';
import { searchTags } from '../utils/text';
import Worker from '../worker';

export const addPosts = (postsData = []) => (dispatch) => {
  const posts = [];
  const users = [];
  const organizations = [];

  const parsePost = (post) => {
    if (post.user) {
      users.push(post.user);
    }

    if (post.organization) {
      organizations.push(post.organization);
    }

    if (post.post) {
      parsePost(post.post);
    }

    posts.push(post);
  };

  postsData.forEach(parsePost);

  dispatch(addUsers(users));
  dispatch(addOrganizations(organizations));
  dispatch({ type: 'ADD_POSTS', payload: posts });
};

export const postsFetch = ({
  postId,
}) => async (dispatch) => {
  const data = await graphql.getOnePost({ postId });
  dispatch(commentsAddContainerData({
    containerId: COMMENTS_CONTAINER_ID_POST,
    entryId: postId,
    parentId: 0,
    comments: data.comments.data,
    metadata: data.comments.metadata,
  }));
  delete data.comments;
  dispatch(addPosts([data]));
  return data;
};

export const getOnePostOffer = ({
  postId,
  commentsPage,
  commentsPerPage,
  usersTeamQuery,
}, options) => async (dispatch) => {
  const data = await graphql.getOnePostOffer({
    postId,
    commentsPage,
    commentsPerPage,
    usersTeamQuery,
  }, options);
  dispatch(commentsAddContainerData({
    containerId: COMMENTS_CONTAINER_ID_POST,
    entryId: postId,
    parentId: 0,
    comments: data.onePostOffer.comments.data,
    metadata: data.onePostOffer.comments.metadata,
  }));
  delete data.onePostOffer.comments;
  dispatch(addPosts([data.onePostOffer]));
  return data;
};

export const getOnePostOfferWithUserAirdrop = ({
  airdropFilter,
  postId,
  commentsPage,
  commentsPerPage,
  usersTeamQuery,
}, options) => async (dispatch) => {
  const data = await graphql.getOnePostOfferWithUserAirdrop({
    airdropFilter,
    postId,
    commentsPage,
    commentsPerPage,
    usersTeamQuery,
  }, options);
  dispatch(commentsAddContainerData({
    containerId: COMMENTS_CONTAINER_ID_POST,
    entryId: postId,
    parentId: 0,
    comments: data.onePostOffer.comments.data,
    metadata: data.onePostOffer.comments.metadata,
  }));
  delete data.onePostOffer.comments;
  dispatch(addPosts([data.onePostOffer]));
  return data;
};

export const createMediaPost = (
  {
    title,
    description,
    leadingText,
    organizationId,
    entityImages = {},
  },
  accountName,
  privateKey,
) => async (dispatch) => {
  let result;
  const content = {
    title,
    description,
    leading_text: leadingText,
    entity_images: entityImages,
    entity_tags: searchTags(description),
  };

  if (organizationId) {
    result = await dispatch(multiSignActions.createPost(organizationId, content));
  } else {
    const transaction = await Worker.signCreatePublicationFromUser(
      accountName,
      privateKey,
      content,
      TRANSACTION_PERMISSION_SOCIAL,
    );

    const data = {
      ...omit(content, ['entity_tags']),
      ...(organizationId ? { organization_id: organizationId } : null),
      post_type_id: POST_TYPE_MEDIA_ID,
      signed_transaction: JSON.stringify(transaction.signed_transaction),
      blockchain_id: transaction.blockchain_id,
    };

    result = await api.createPost(data);
  }

  return result;
};

export const updateMediaPost = (
  {
    id,
    title,
    description,
    leadingText,
    organizationId,
    blockchainId,
    createdAt,
    entityImages = {},
  },
  accountName,
  privateKey,
) => async (dispatch) => {
  let result;
  const content = {
    title,
    description,
    leading_text: leadingText,
    entity_images: entityImages,
    entity_tags: searchTags(description),
    created_at: createdAt,
    blockchain_id: blockchainId,
  };

  if (organizationId) {
    result = await dispatch(multiSignActions.updatePost(organizationId, id, content));
  } else {
    const signed_transaction = await Worker.signUpdatePublicationFromUser(
      accountName,
      privateKey,
      content,
      blockchainId,
      TRANSACTION_PERMISSION_SOCIAL,
    );

    const data = {
      ...omit(content, ['entity_tags']),
      post_type_id: POST_TYPE_MEDIA_ID,
      signed_transaction: JSON.stringify(signed_transaction),
    };

    result = await api.updatePost(data, id);
  }

  return result;
};

export const createDirectPost = (
  ownerId,
  ownerAccountName,
  ownerPrivateKey,
  userId,
  userAccountName,
  orgId,
  orgBlockchainId,
  data,
) => async (dispatch) => {
  const postContent = {
    description: data.description,
    entity_images: data.entityImages,
    post_type_id: data.postTypeId,
    entity_tags: searchTags(data.description),
  };

  let signed_transaction;
  let blockchain_id;
  let post;

  if (!orgBlockchainId) {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateDirectPostForAccount(
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      postContent,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  } else {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateDirectPostForOrganization(
      ownerAccountName,
      orgBlockchainId,
      ownerPrivateKey,
      postContent,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  }

  if (!orgId) {
    post = await api.createUserCommentPost(userId, {
      ...omit(postContent, ['entity_tags']),
      signed_transaction: JSON.stringify(signed_transaction),
      blockchain_id,
    });
  } else {
    post = await api.createOrganizationsCommentPost(orgId, {
      ...omit(postContent, ['entity_tags']),
      signed_transaction: JSON.stringify(signed_transaction),
      blockchain_id,
    });
  }

  dispatch(addPosts([post]));

  return post;
};

export const upadteDirectPost = (
  ownerAccountName,
  ownerPrivateKey,
  postBlockchainId,
  userAccountName,
  postId,
  orgId,
  orgBlockchainId,
  data,
) => async (dispatch) => {
  const postContent = {
    id: data.id,
    description: data.description,
    entity_images: data.entityImages,
    post_type_id: data.postTypeId,
    entity_tags: searchTags(data.description),
    blockchain_id: data.blockchainId,
    created_at: data.createdAt,
  };

  let signed_transaction;

  if (!orgId) {
    signed_transaction = await Worker.signUpdateDirectPostForAccount(
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      postContent,
      postBlockchainId,
      TRANSACTION_PERMISSION_SOCIAL,
    );
  } else {
    signed_transaction = await Worker.signUpdateDirectPostForOrganization(
      ownerAccountName,
      ownerPrivateKey,
      orgBlockchainId,
      postContent,
      postBlockchainId,
      TRANSACTION_PERMISSION_SOCIAL,
    );
  }

  const post = await api.updatePost({
    ...omit(postContent, ['entity_tags']),
    signed_transaction: JSON.stringify(signed_transaction),
  }, postId);

  dispatch(addPosts([post]));

  return post;
};

export const createRepost = (
  ownerAccountName,
  ownerPrivateKey,
  postBlockchainId,
  postId,
) => async () => {
  const postContent = {
    parent_id: postId,
  };

  const { signed_transaction, blockchain_id } = await Worker.signCreateRepostPostForAccount(
    ownerAccountName,
    ownerPrivateKey,
    postBlockchainId,
    postContent,
    TRANSACTION_PERMISSION_SOCIAL,
  );

  const result = await api.repostPost(postId, {
    ...postContent,
    signed_transaction: JSON.stringify(signed_transaction),
    blockchain_id,
  });

  return result;
};
