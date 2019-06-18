import { TAB_ID_COMMUNITIES } from '../components/Feed/Tabs';

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
      return {
        ...state,
        ...action.payload,
        feed: {
          ...state.feed,
          ...action.payload.feed,
        },
        usersPopup: {
          ...state.usersPopup,
          ...action.payload.usersPopup,
        },
        organizationsPopup: {
          ...state.organizationsPopup,
          ...action.payload.organizationsPopup,
        },
        tagsPopup: {
          ...state.tagsPopup,
          ...action.payload.tagsPopup,
        },
      };

    default:
      return state;
  }
};
