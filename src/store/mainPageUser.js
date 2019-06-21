import { merge } from 'lodash';

const getInitialState = () => ({
  topPostsIds: [],
  orgs: {
    ids: [],
    metadata: {},
  },
  orgsPopup: {
    ids: [],
    metadata: {},
  },
  usersIds: [],
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'MAIN_PAGE_USER_SET_DATA':
      return merge(state, action.payload);

    default:
      return state;
  }
};
