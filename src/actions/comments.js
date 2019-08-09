import api from '../api';
import graphql from '../api/graphql';
import loader from '../utils/loader';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../utils/constants';
import { addServerErrorNotification } from './notifications';
import { addUsers } from './users';

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
  dispatch({
    type: 'ADD_COMMENTS',
    payload: comments,
  });
};

// TODO: Move to voting.js
export const commentVote = ({
  isUp,
  postId,
  commentId,
}) => async (dispatch) => {
  try {
    const data = await api.vote(isUp, postId, commentId);
    dispatch({
      type: 'SET_COMMENT_VOTE',
      payload: {
        id: commentId,
        currentVote: data.currentVote,
        myselfVote: isUp ? UPVOTE_STATUS : DOWNVOTE_STATUS,
      },
    });
  } catch (err) {
    throw err;
  }
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

export const createComment = ({
  containerId,
  data,
  postId,
  commentId,
}) => async (dispatch) => {
  loader.start();
  try {
    const commentData = await api.createComment(data, postId, commentId);
    commentData.isNew = true;
    dispatch(commentsAddContainerData({
      containerId,
      entryId: postId,
      comments: [commentData],
    }));
  } catch (e) {
    console.error(e);
    dispatch(addServerErrorNotification(e));
  }
  loader.done();
};
