import merge from '../utils/merge';

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
  users: {
    ids: [],
    metadata: {},
  },
  usersPopup: {
    ids: [],
    metadata: {},
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'MAIN_PAGE_USER_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
