import { uniq } from 'lodash';
import { COMMENTS_CONTAINER_ID_FEED_POST, COMMENTS_CONTAINER_ID_POST } from '../utils/comments';

const getInitialState = () => ({
  data: {},
  containersData: {
    [COMMENTS_CONTAINER_ID_FEED_POST]: {},
    [COMMENTS_CONTAINER_ID_POST]: {},
  },
});

const comments = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'RESET_COMMENTS':
      return getInitialState();

    case 'ADD_COMMENTS':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.reduce((result, item) => ({
            ...result,
            [item.id]: { ...state.data[item.id], ...item },
          }), {}),
        },
      };

    case 'SET_COMMENT_VOTE':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.id]: {
            ...state.data[action.payload.id],
            currentVote: action.payload.currentVote,
            myselfData: {
              ...state.data[action.payload.id].myselfData,
              myselfVote: action.payload.myselfVote,
            },
          },
        },
      };

    case 'COMMENTS_ADD_CONTAINER_DATA':
      return {
        ...state,
        containersData: {
          ...state.containersData,
          [action.payload.containerId]: {
            ...state.containersData[action.payload.containerId],
            [action.payload.entryId]: {
              ...state.containersData[action.payload.containerId][action.payload.entryId],
              commentIds: uniq(state.containersData[action.payload.containerId][action.payload.entryId]
                ? state.containersData[action.payload.containerId][action.payload.entryId].commentIds.concat(action.payload.commentIds)
                : action.payload.commentIds),
              metadata: {
                ...(state.containersData[action.payload.containerId][action.payload.entryId] ? state.containersData[action.payload.containerId][action.payload.entryId].metadata : null),
                ...(action.payload.metadata ? { [action.payload.parentId]: action.payload.metadata } : null),
              },
            },
          },
        },
      };

    case 'COMMENTS_RESET_CONTAINER_DATA_BY_ENTRY_ID':
      return {
        ...state,
        containersData: {
          ...state.containersData,
          [action.payload.containerId]: {
            ...state.containersData[action.payload.containerId],
            [action.payload.entryId]: null,
          },
        },
      };

    case 'COMMENTS_RESET_CONTAINER_DATA_BY_ID':
      return {
        ...state,
        containersData: {
          ...state.containersData,
          [action.payload.containerId]: {},
        },
      };

    default:
      return state;
  }
};

export const getCommentById = (comments, commentId) => comments.data[commentId];

export const getCommentsByIds = (comments, ids) => {
  if (ids && ids.length) {
    return ids.map(id => comments.data[id]);
  }

  return [];
};

export const getCommentsByContainer = (state, containerId, entryId) => state.comments.containersData[containerId][entryId];

export default comments;
