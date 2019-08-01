import merge from '../utils/merge';

const getInitialState = () => ({
  loaded: false,
  followedBy: {
    ids: [],
    metadata: {},
  },
  followedByPopup: {
    ids: [],
    metadata: {},
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'ORG_PAGE_RESET':
      return getInitialState();

    case 'ORG_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
