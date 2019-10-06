import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_POPUP', () => ({
  visible: false,
}));

export { actions };
export default reducer;
