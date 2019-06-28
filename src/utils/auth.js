import { removeToken } from './token';
import { removeActiveKey, removeEncryptedActiveKey } from './keys';

export const logout = () => {
  removeEncryptedActiveKey();
  removeActiveKey();
  removeToken();
  window.location.reload();
};
