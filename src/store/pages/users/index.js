import merge from '../../../utils/merge';

const getInitialState = () => ({
  ids: [],
  metadata: {},
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'USERS_PAGE_RESET':
      return getInitialState();

    case 'USERS_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
