let queue = 0;

export const setData = payload => ({ type: 'LOADER_SET_DATA', payload });

export const start = () => (dispatch) => {
  queue++;
  setTimeout(() => {
    dispatch(setData({ start: true }));
  }, 0);
};

export const done = () => (dispatch) => {
  if (queue > 0) {
    queue--;
  }

  if (queue === 0) {
    dispatch(setData({ done: true }));

    setTimeout(() => {
      dispatch(setData({ done: false, start: false }));
    }, 700);
  }
};
