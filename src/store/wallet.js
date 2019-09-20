import merge from '../utils/merge';

const getInitialState = () => ({
  visible: false,
  buyRamVisible: false,
  sellRamVisible: false,
  editStakeVisible: false,
  sendTokensVisibility: false,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'WALLET_RESET':
      return getInitialState();

    case 'WALLET_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
