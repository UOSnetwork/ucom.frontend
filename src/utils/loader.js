import * as loderActions from '../actions/loader';

let dispatch;

export default {
  init(dispatchFn) {
    dispatch = dispatchFn;
  },

  start() {
    if (dispatch) {
      dispatch(loderActions.start());
    }
  },

  done() {
    if (dispatch) {
      dispatch(loderActions.done());
    }
  },
};
