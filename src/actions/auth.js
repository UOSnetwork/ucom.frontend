import api from '../api';
import snakes from '../utils/snakes';
import { saveToken } from '../utils/token';
import { saveActiveKey, getActivePrivateKey } from '../utils/keys';
import { selectOwner } from '../store/selectors';

export const reset = () => ({ type: 'AUTH_RESET' });
export const setData = payload => ({ type: 'AUTH_SET_DATA', payload });

// TODO: Rename to showPopup
export const authShowPopup = redirectUrl => (dispatch) => {
  dispatch(reset());
  dispatch(setData({
    redirectUrl,
    visibility: true,
  }));
};

export const hidePopup = () => (dispatch) => {
  dispatch(setData({
    redirectUrl: undefined,
    visibility: false,
  }));
};

export const login = (brainkey, accountName) => async (dispatch, getState) => {
  const state = getState();
  const { redirectUrl } = state.auth;

  try {
    const data = await api.login(snakes({ brainkey, accountName }));

    saveToken(data.token);
    saveActiveKey(getActivePrivateKey(brainkey));

    if (redirectUrl) {
      window.location.replace(redirectUrl);
    } else {
      window.location.reload();
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const checkBrainkey = brainkey => async (dispatch, getState) => {
  const state = getState();
  const owner = selectOwner(state);
  const { accountName } = owner;

  try {
    const data = await api.login(snakes({ brainkey, accountName }));
    saveToken(data.token);
    saveActiveKey(getActivePrivateKey(brainkey));
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
