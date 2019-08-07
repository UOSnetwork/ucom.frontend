import merge from '../utils/merge';

const getInitialState = () => ({
  visible: false,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'SUBSCRIBE_RESET':
      return getInitialState();

    case 'SUBSCRIBE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
