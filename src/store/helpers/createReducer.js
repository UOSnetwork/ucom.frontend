import merge from '../../utils/merge';

export default (prefix, getInitialStateFn) => {
  const ACTION_TYPE_RESET = `${prefix}_RESET`;
  const ACTION_TYPE_MERGE = `${prefix}_MERGE`;

  const reducer = (state = getInitialStateFn(), action) => {
    switch (action.type) {
      case ACTION_TYPE_RESET:
        return getInitialStateFn();

      case ACTION_TYPE_MERGE:
        return merge({}, state, action.payload);

      default:
        return state;
    }
  };

  const actions = {
    reset: payload => ({ type: ACTION_TYPE_RESET, payload }),
    merge: payload => ({ type: ACTION_TYPE_MERGE, payload }),
  };

  return { reducer, actions };
};
