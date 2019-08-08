export const reset = () => ({ type: 'IEO_BANNER_RESET' });

export const setData = payload => ({ type: 'IEO_BANNER_SET_DATA', payload });

export const close = () => (dispatch) => {
  localStorage.setItem('ieobanner.closed', 1);
  dispatch(setData({ visible: false }));
};

export const show = () => (dispatch) => {
  localStorage.setItem('ieobanner.closed', 0);
  dispatch(setData({ visible: true }));
};

export const init = () => (dispatch) => {
  if (+localStorage.getItem('ieobanner.closed') !== 1) {
    dispatch(show());
  }
};
