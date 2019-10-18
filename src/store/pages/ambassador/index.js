import createReducer from '../../helpers/createReducer';

const { reducer, actions } = createReducer('PAGE_AMBASSADOR', () => ({
  userId: null,
  users: [],
  joined: null,
}));

export { actions };
export default reducer;
