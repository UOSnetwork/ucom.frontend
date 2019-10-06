import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_BUY_RAM', () => ({
  visible: false,
}));

export { actions };
export default reducer;
