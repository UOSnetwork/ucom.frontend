import merge from '../utils/merge';

const getInitialState = () => ({
  hover: false,
});

const mediaQuery = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'MEDIA_QUERY_RESET':
      return getInitialState();

    case 'MEDIA_QUERY_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};

export default mediaQuery;
