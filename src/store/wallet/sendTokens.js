import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_SEND_TOKENS', () => ({
  visible: false,
}));

export { actions };
export default reducer;
