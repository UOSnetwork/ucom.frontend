import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_SELL_RAM', () => ({
  visible: false,
}));

export { actions };
export default reducer;
