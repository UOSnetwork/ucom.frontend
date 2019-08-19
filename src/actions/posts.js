import Wallet from 'ucom-libs-wallet';
import { omit } from 'lodash';
import api, { graphql } from '../api';
import { addUsers } from './users';
import { addOrganizations, getOrganization } from './organizations';
import { POST_TYPE_MEDIA_ID } from '../utils/constants';
import { commentsAddContainerData } from './comments';
import { COMMENTS_CONTAINER_ID_POST } from '../utils/comments';
import { searchTags } from '../utils/text';

const { PublicationsApi } = Wallet.Content;

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
  try {
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
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addRepost = postId => async () => {
  try {
    await api.repostPost(postId);
  } catch (err) {
    throw err;
  }
};

export const getOnePostOffer = ({
  postId,
  commentsPage,
  commentsPerPage,
  usersTeamQuery,
}, options) => async (dispatch) => {
  try {
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
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getOnePostOfferWithUserAirdrop = ({
  airdropFilter,
  postId,
  commentsPage,
  commentsPerPage,
  usersTeamQuery,
}, options) => async (dispatch) => {
  try {
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
  } catch (e) {
    console.error(e);
    throw e;
  }
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
  try {
    const content = {
      title,
      description,
      leading_text: leadingText,
      entity_images: entityImages,
      entity_tags: searchTags(description),
    };

    let transaction;

    if (organizationId) {
      const organization = await dispatch(getOrganization(organizationId));
      transaction = await PublicationsApi.signCreatePublicationFromOrganization(accountName, privateKey, organization.blockchainId, content);
    } else {
      transaction = await PublicationsApi.signCreatePublicationFromUser(accountName, privateKey, content);
    }

    const data = {
      ...omit(content, ['entity_tags']),
      ...(organizationId ? { organization_id: organizationId } : null),
      post_type_id: POST_TYPE_MEDIA_ID,
      signed_transaction: JSON.stringify(transaction.signed_transaction),
      blockchain_id: transaction.blockchain_id,
    };

    const result = await api.createPost(data);

    return result;
  } catch (err) {
    throw err;
  }
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
  try {
    const content = {
      title,
      description,
      leading_text: leadingText,
      entity_images: entityImages,
      entity_tags: searchTags(description),
      created_at: createdAt,
      blockchain_id: blockchainId,
    };

    let signed_transaction;

    if (organizationId) {
      const organization = await dispatch(getOrganization(organizationId));
      signed_transaction = await PublicationsApi.signUpdatePublicationFromOrganization(accountName, privateKey, organization.blockchainId, content, blockchainId);
    } else {
      signed_transaction = await PublicationsApi.signUpdatePublicationFromUser(accountName, privateKey, content, blockchainId);
    }

    const data = {
      ...omit(content, ['entity_tags']),
      ...(organizationId ? { organization_id: organizationId } : null),
      post_type_id: POST_TYPE_MEDIA_ID,
      signed_transaction: JSON.stringify(signed_transaction),
    };

    const result = await api.updatePost(data, id);

    return result;
  } catch (err) {
    throw err;
  }
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
  try {
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
      ({ signed_transaction, blockchain_id } = await PublicationsApi.signCreateDirectPostForAccount(
        ownerAccountName,
        ownerPrivateKey,
        userAccountName,
        postContent,
      ));
    } else {
      ({ signed_transaction, blockchain_id } = await PublicationsApi.signCreateDirectPostForOrganization(
        ownerAccountName,
        orgBlockchainId,
        ownerPrivateKey,
        postContent,
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
  } catch (err) {
    throw err;
  }
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
  try {
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
      signed_transaction = await PublicationsApi.signUpdateDirectPostForAccount(
        ownerAccountName,
        ownerPrivateKey,
        userAccountName,
        postContent,
        postBlockchainId,
      );
    } else {
      signed_transaction = await PublicationsApi.signUpdateDirectPostForOrganization(
        ownerAccountName,
        ownerPrivateKey,
        orgBlockchainId,
        postContent,
        postBlockchainId,
      );
    }

    const post = await api.updatePost({
      ...omit(postContent, ['entity_tags']),
      signed_transaction: JSON.stringify(signed_transaction),
    }, postId);

    dispatch(addPosts([post]));

    return post;
  } catch (err) {
    throw err;
  }
};
