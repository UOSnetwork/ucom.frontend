import { TAB_ID_COMMUNITIES } from '../components/Feed/Tabs';
import merge from '../utils/merge';

const getInitialState = () => ({
  activeTabId: TAB_ID_COMMUNITIES,
  feed: {
    userIds: [],
    loading: false,
    hasMore: false,
    page: 1,
    postsIds: [],
    organizationsIds: [],
    tagsIds: [],
  },
  usersPopup: {
    ids: [],
    metadata: {},
  },
  organizationsPopup: {
    ids: [],
    metadata: {},
  },
  tagsPopup: {
    ids: [],
    metadata: {},
  },
  topPostsIds: [],
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'MAIN_PAGE_RESET':
      return getInitialState();

    case 'MAIN_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
