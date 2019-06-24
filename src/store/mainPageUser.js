const getInitialState = () => ({
  usersIds: [],
  topPostsIds: [],
  orgs: {
    ids: [],
    metadata: {},
  },
  orgsPopup: {
    ids: [],
    metadata: {},
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'MAIN_PAGE_USER_SET_DATA':
      return {
        ...state,
        ...action.payload,
        orgs: {
          ...state.orgs,
          ...action.payload.orgs,
        },
        orgsPopup: {
          ...state.orgsPopup,
          ...action.payload.orgsPopup,
        },
      };

    default:
      return state;
  }
};
