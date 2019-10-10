import { SocialKeyApi } from 'ucom-libs-wallet';
import api from '../api';
import { saveToken } from '../utils/token';
import { saveSocialKey } from '../utils/keys';
import { selectOwner } from '../store/selectors';
import Worker from '../worker';

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

export const loginByScatter = (accountName, socialPublicKey, sign) => async (dispatch) => {
  const data = await api.login(accountName, socialPublicKey, sign);

  saveToken(data.token);
  dispatch(redirectAfterLoginIfNeedOrRefresh());
};

export const loginBySocialKey = (socialKey, accountName) => async (dispatch) => {
  const sign = await Worker.eccSign(accountName, socialKey);
  const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
  const data = await api.login(accountName, socialPublicKey, sign);

  saveToken(data.token);
  saveSocialKey(socialKey);
  dispatch(redirectAfterLoginIfNeedOrRefresh());
};

export const recoveryByBrainkey = (brainkey, accountName) => async () => {
  let socialKey;

  try {
    const activeKey = await Worker.getActiveKeyByBrainKey(brainkey);
    socialKey = await Worker.getSocialKeyByActiveKey(activeKey);
    const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
    const sign = await Worker.eccSign(accountName, socialKey);
    const socialKeyIsBinded = await SocialKeyApi.getAccountCurrentSocialKey(accountName);

    if (!socialKeyIsBinded) {
      await Worker.bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey);
    } else {
      await Worker.addSocialPermissionsToEmissionAndProfile(accountName, activeKey);
    }

    await api.login(accountName, socialPublicKey, sign);
  } catch (err) {
    throw new Error('Brainkey is wrong');
  }

  return socialKey;
};

export const recoveryByActiveKey = (activeKey, accountName) => async () => {
  let socialKey;

  try {
    socialKey = await Worker.getSocialKeyByActiveKey(activeKey);
    const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
    const sign = await Worker.eccSign(accountName, socialKey);
    const socialKeyIsBinded = await SocialKeyApi.getAccountCurrentSocialKey(accountName);

    if (!socialKeyIsBinded) {
      await Worker.bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey);
    } else {
      await Worker.addSocialPermissionsToEmissionAndProfile(accountName, activeKey);
    }

    await api.login(accountName, socialPublicKey, sign);
  } catch (err) {
    throw new Error('Active key is wrong');
  }

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
