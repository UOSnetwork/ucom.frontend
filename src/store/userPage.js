const getInitialState = () => ({
  loaded: false,
  trustLoading: false,
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
  followedPopup: {
    ids: [],
    metadata: {},
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'USER_PAGE_RESET':
      return getInitialState();

    case 'USER_PAGE_SET_DATA':
      return {
        ...state,
        ...action.payload,
        trustedBy: {
          ...state.trustedBy,
          ...action.payload.trustedBy,
        },
        trustedByPopup: {
          ...state.trustedBy,
          ...action.payload.trustedBy,
        },
        orgs: {
          ...state.orgs,
          ...action.payload.orgs,
        },
        orgsPopup: {
          ...state.orgsPopup,
          ...action.payload.orgsPopup,
        },
        iFollow: {
          ...state.iFollow,
          ...action.payload.iFollow,
        },
        iFollowPopup: {
          ...state.iFollowPopup,
          ...action.payload.iFollowPopup,
        },
        followedBy: {
          ...state.followedBy,
          ...action.payload.followedBy,
        },
        followedByPopup: {
          ...state.followedByPopup,
          ...action.payload.followedByPopup,
        },
      };

    default:
      return state;
  }
};
