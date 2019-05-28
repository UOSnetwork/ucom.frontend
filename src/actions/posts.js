import humps from 'lodash-humps';
import api from '../api';
import graphql from '../api/graphql';
import { addUsers } from './users';
import { addOrganizations } from './organizations';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../utils/posts';
import { addServerErrorNotification } from './notifications';
import { addComments, commentsAddContainerData } from './comments';
import { COMMENTS_CONTAINER_ID_POST } from '../utils/comments';
import snakes from '../utils/snakes';
import loader from '../utils/loader';

export const setPostVote = payload => ({ type: 'SET_POST_VOTE', payload });
export const setPostCommentCount = payload => ({ type: 'SET_POST_COMMENT_COUNT', payload });

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

export const fetchPost = postId => async (dispatch) => {
  try {
    const data = await api.getPost(postId);
    dispatch(addComments(humps(data.comments)));
    dispatch(addPosts([data]));
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const postsFetch = ({
  postId,
}) => async (dispatch) => {
  try {
    const data = await graphql.getOnePost({
      postId,
    });
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
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updatePost = payload => (dispatch) => {
  loader.start();
  api.updatePost(snakes(payload.data), payload.postId)
    .then((data) => {
      dispatch(addPosts([data]));
    })
    .catch((error) => {
      dispatch(addServerErrorNotification(error));
    })
    .then(() => loader.done());
};

export const addRepost = postId => (dispatch) => {
  loader.start();
  api.repostPost(postId)
    .catch((error) => {
      dispatch(addServerErrorNotification(error));
    })
    .then(() => loader.done());
};

export const postVote = payload => (dispatch) => {
  loader.start();
  api.vote(payload.isUp, payload.postId)
    .then(humps)
    .then((data) => {
      dispatch(setPostVote({
        id: payload.postId,
        currentVote: data.currentVote,
        myselfVote: payload.isUp ? UPVOTE_STATUS : DOWNVOTE_STATUS,
      }));
    })
    .catch((error) => {
      dispatch(addServerErrorNotification(error));
    })
    .then(() => loader.done());
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
