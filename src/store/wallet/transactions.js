import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_TRANSACTIONS', () => ({
  data: [],
  metadata: {},
}));

export { actions };
export default reducer;
