import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_ACCOUNT', () => ({
  visible: false,
}));

export { actions };
export default reducer;
