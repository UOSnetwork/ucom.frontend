import api from '../api';
import snakes from '../utils/snakes';
import { saveToken } from '../utils/token';
import { getActivePrivateKey, getSocialPrivateKeyByActiveKey, saveSocialKey } from '../utils/keys';
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

export const redirectAfterLoginIfNeedOrRefresh = () => (dispatch, getState) => {
  const state = getState();
  const { redirectUrl } = state.auth;

  if (redirectUrl) {
    window.location.replace(redirectUrl);
  } else {
    window.location.reload();
  }
};

export const login = (brainkey, accountName) => async (dispatch) => {
  const data = await api.loginByBrainkey(snakes({ brainkey, accountName }));
  const activePrivateKey = getActivePrivateKey(brainkey);
  const socialPrivateKey = getSocialPrivateKeyByActiveKey(activePrivateKey);

  saveToken(data.token);
  saveSocialKey(socialPrivateKey);
  dispatch(redirectAfterLoginIfNeedOrRefresh());
};

export const loginBySocialKey = (socialKey, accountName) => async (dispatch) => {
  const resp = await api.loginBySocialKey(socialKey, accountName);

  saveToken(resp.token);
  saveSocialKey(socialKey);
  dispatch(redirectAfterLoginIfNeedOrRefresh());
};

export const recoveryByBrainkey = (brainkey, accountName) => async () => {
  try {
    await api.loginByBrainkey(brainkey, accountName);
  } catch (err) {
    throw new Error('Brainkey is wrong');
  }

  const activeKey = getActivePrivateKey(brainkey);
  const socialKey = getSocialPrivateKeyByActiveKey(activeKey);

  return socialKey;
};

export const recoveryByActiveKey = (activeKey, accountName) => async () => {
  try {
    await api.loginByActiveKey(activeKey, accountName);
  } catch (err) {
    throw new Error('Active key is wrong');
  }

  const socialKey = getSocialPrivateKeyByActiveKey(activeKey);

  return socialKey;
};

export const checkBrainkey = brainkey => async (dispatch, getState) => {
  const state = getState();
  const owner = selectOwner(state);
  const { accountName } = owner;
  const data = await api.loginByBrainkey(brainkey, accountName);

  saveToken(data.token);

  return true;
};
