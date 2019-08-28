import { removeToken } from './token';
import { removeActiveKey, removeEncryptedActiveKey, socialKeyIsExists, removeSocialKey } from './keys';

export const logout = () => {
  removeEncryptedActiveKey();
  removeActiveKey();
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
