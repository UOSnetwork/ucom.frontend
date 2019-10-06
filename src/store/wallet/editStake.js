import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_EDIT_STAKE', () => ({
  visible: false,
}));

export { actions };
export default reducer;
