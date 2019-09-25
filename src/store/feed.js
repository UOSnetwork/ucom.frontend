import { merge, uniq } from 'lodash';
import { FEED_EXCLUDE_FILTER_ID_ALL } from '../utils';

const getInitialState = () => ({
  loading: false,
  postIds: [],
  metadata: {
    hasMore: false,
    page: 1,
  },
  manyUsers: [],
  manyOrganizations: [],
  manyTags: [],
  excludeFilterId: FEED_EXCLUDE_FILTER_ID_ALL,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'POSTS_FEED_RESET':
      return getInitialState();

    case 'POSTS_FEED_SET_EXCLUDE_FILTER_ID':
      return { ...state, excludeFilterId: action.payload };

    case 'POSTS_FEED_SET_POST_IDS':
      return { ...state, postIds: action.payload };

    case 'POSTS_FEED_PREPEND_POST_IDS':
      return { ...state, postIds: uniq(action.payload.concat(state.postIds)) };

    case 'POSTS_FEED_APPEND_POST_IDS':
      return { ...state, postIds: uniq(state.postIds.concat(action.payload)) };

    case 'POSTS_FEED_SET_METADATA':
      return { ...state, metadata: action.payload };

    case 'POSTS_FEED_SET_LOADING':
      return { ...state, loading: action.payload };

    case 'POSTS_FEED_SET_SIDE_USERS':
      return { ...state, manyUsers: merge(state.manyUsers, action.payload) };

    case 'POSTS_FEED_SET_SIDE_ORGANIZATIONS':
      return { ...state, manyOrganizations: action.payload };

    case 'POSTS_FEED_SET_SIDE_TAGS':
      return { ...state, manyTags: merge(state.manyTags, action.payload) };

    default:
      return state;
  }
};
