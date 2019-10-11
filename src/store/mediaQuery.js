import createReducer from './helpers/createReducer';

const { reducer, actions } = createReducer('MEDIA_QUERY', () => ({
  hover: false,
  medium: false,
  small: false,
  xsmall: false,
}));

export { actions };
export default reducer;
