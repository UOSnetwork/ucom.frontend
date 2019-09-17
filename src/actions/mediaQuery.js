export const setData = payload => ({ type: 'MEDIA_QUERY_SET_DATA', payload });

export const init = () => (dispatch) => {
  if (typeof window === 'undefined') {
    return;
  }

  const hover = !window.matchMedia('(hover: none)').matches;

  dispatch(setData({ hover }));
};
