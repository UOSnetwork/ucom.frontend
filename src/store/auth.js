import merge from '../utils/merge';

const getInitialState = () => ({
  redirectUrl: undefined,
  visibility: false,
});

const auth = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'AUTH_RESET':
      return getInitialState();

    case 'AUTH_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};

export default auth;
