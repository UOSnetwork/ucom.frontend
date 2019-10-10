import { removeToken } from './token';
import { removeEncryptedActiveKey, removeSocialKey } from './keys';

export const logout = () => {
  removeEncryptedActiveKey();
  removeSocialKey();
  removeToken();
};

export const logoutAndReload = () => {
  logout();
  window.location.reload();
};
