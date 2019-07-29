import * as axios from 'axios';

export const setData = payload => ({ type: 'SUBSCRIBE_SET_DATA', payload });

export const reset = payload => ({ type: 'SUBSCRIBE_RESET', payload });

export const show = () => dispatch => dispatch(setData({ visible: true }));

export const hide = () => dispatch => dispatch(setData({ visible: false }));

export const submit = email => async () => {
  try {
    return await axios.post('/subscribe', { email });
  } catch (err) {
    throw err;
  }
};
