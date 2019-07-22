import merge from '../utils/merge';

const getInitialState = () => ({
  refferals: {
    ids: [],
    popupIds: [],
    metadata: {},
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'SETTINGS_RESET':
      return getInitialState();

    case 'SETTINGS_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
