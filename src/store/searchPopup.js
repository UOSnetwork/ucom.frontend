import merge from '../utils/merge';

const getInitialState = () => ({
  visible: false,
  query: '',
  loading: true,
  result: {
    users: {
      ids: [],
      hasMore: false,
    },
    orgs: {
      ids: [],
    },
    tags: {
      ids: [],
    },
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'SEARCH_POPUP_RESET':
      return getInitialState();

    case 'SEARCH_POPUP_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
