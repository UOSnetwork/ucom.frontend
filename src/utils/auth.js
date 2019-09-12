import { removeToken } from './token';
import { removeEncryptedActiveKey, socialKeyIsExists, removeSocialKey } from './keys';

export const logout = () => {
  removeEncryptedActiveKey();
  removeSocialKey();
  removeToken();
};

export const logoutAndReload = () => {
  logout();
  window.location.reload();
};

export const logoutIfNeedBindSocialKey = () => {
  if (!socialKeyIsExists()) {
    logout();
  }
};
