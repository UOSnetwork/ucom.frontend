import merge from '../utils/merge';

const getInitialState = () => ({
  visible: false,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'IEO_BANNER_RESET':
      return getInitialState();

    case 'IEO_BANNER_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
