import merge from '../utils/merge';

const getInitialState = () => ({
  userIdentity: null,
  loaded: false,
  trustedBy: {
    ids: [],
    metadata: {},
  },
  trustedByPopup: {
    ids: [],
    metadata: {},
  },
  orgs: {
    ids: [],
    metadata: {},
  },
  orgsPopup: {
    ids: [],
    metadata: {},
  },
  iFollow: {
    ids: [],
    metadata: {},
  },
  iFollowPopup: {
    ids: [],
    metadata: {},
  },
  followedBy: {
    ids: [],
    metadata: {},
  },
  followedByPopup: {
    ids: [],
    metadata: {},
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'USER_PAGE_RESET':
      return getInitialState();

    case 'USER_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
