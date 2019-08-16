import merge from '../utils/merge';

const getInitialState = () => ({
  active: false,
  done: false,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'LOADER_RESET':
      return getInitialState();

    case 'LOADER_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
