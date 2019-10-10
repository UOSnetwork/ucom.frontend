import createReducer from '../helpers/createReducer';

const { reducer, actions } = createReducer('WALLET_SEND_TOKENS', () => ({
  visible: false,
  editable: true,
  loading: false,
  accountName: '',
  amount: '',
  memo: '',
  error: '',
  successCallback: undefined,
  failCallbcak: undefined,
}));

export { actions };
export default reducer;
