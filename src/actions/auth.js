import api from '../api';
import snakes from '../utils/snakes';
import { saveToken } from '../utils/token';
import { saveActiveKey, getActivePrivateKey, getSocialPrivateKeyByActiveKey, saveSocialKey } from '../utils/keys';
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

  const data = await api.login(snakes({ brainkey, accountName }));
  const activePrivateKey = getActivePrivateKey(brainkey);
  const socialPrivateKey = getSocialPrivateKeyByActiveKey(activePrivateKey);

  saveToken(data.token);
  saveActiveKey(activePrivateKey);
  saveSocialKey(socialPrivateKey);

  if (redirectUrl) {
    window.location.replace(redirectUrl);
  } else {
    window.location.reload();
  }
};

export const checkBrainkey = brainkey => async (dispatch, getState) => {
  const state = getState();
  const owner = selectOwner(state);
  const { accountName } = owner;

  const data = await api.login(snakes({ brainkey, accountName }));
  saveToken(data.token);
  saveActiveKey(getActivePrivateKey(brainkey));

  return true;
};
