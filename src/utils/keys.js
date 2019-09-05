import CryptoJS from 'crypto-js';
import ecc from 'eosjs-ecc';
import { memoize } from 'lodash';

export const privateKeyIsValid = memoize((value) => {
  try {
    return ecc.isValidPrivate(value);
  } catch (e) {
    return false;
  }
});

export const passwordIsValid = memoize((password) => {
  try {
    return password.length > 0;
  } catch (e) {
    return false;
  }
});

export const getOwnerPrivateKey = memoize(brainkey => ecc.seedPrivate(brainkey));

export const getActivePrivateKey = memoize((brainkey) => {
  const ownerKey = getOwnerPrivateKey(brainkey);
  const activeKey = ecc.seedPrivate(ownerKey);
  return activeKey;
});

export const getSocialPrivateKeyByBrainkey = memoize((brainkey) => {
  const activeKey = getActivePrivateKey(brainkey);
  const socialKey = ecc.seedPrivate(activeKey);
  return socialKey;
});

export const getSocialPrivateKeyByActiveKey = memoize((activeKey) => {
  const socialKey = ecc.seedPrivate(activeKey);
  return socialKey;
});

export const getOwnerPublicKeyByBrainkey = memoize((brainkey) => {
  const ownerKey = getOwnerPrivateKey(brainkey);
  const ownerPublicKey = ecc.privateToPublic(ownerKey);
  return ownerPublicKey;
});

export const getActivePublicKeyByBrainkey = memoize((brainkey) => {
  const activeKey = getActivePrivateKey(brainkey);
  const activePublicKey = ecc.privateToPublic(activeKey);
  return activePublicKey;
});

export const getPublicKeyByPrivateKey = memoize(privateKey =>
  ecc.privateToPublic(privateKey));

export const encryptedActiveKeyIsExists = () => {
  try {
    const activeKey = localStorage.getItem('encryptedActiveKey');
    return activeKey && activeKey.length;
  } catch (e) {
    return false;
  }
};

export const saveAndEncryptActiveKey = (activeKey, password) => {
  if (!activeKey) {
    throw new Error('Active Key is required');
  }

  if (!privateKeyIsValid(activeKey)) {
    throw new Error('Active Key is not valid');
  }

  if (!password) {
    throw new Error('Password is required');
  }

  if (passwordIsValid(!password)) {
    throw new Error('Password is not valid');
  }

  try {
    const encryptedActiveKey = CryptoJS.AES.encrypt(activeKey, password).toString();
    localStorage.setItem('encryptedActiveKey', encryptedActiveKey);
  } catch (e) {
    console.error(e);
    throw new Error('Save Active Key failed');
  }
};

export const restoreEncryptedActiveKey = (password) => {
  if (!password) {
    throw new Error('Password is required');
  }

  const passwordDoesNotMatchError = new Error('Password does not match');
  let encryptedActiveKey;
  let activeKey;

  try {
    encryptedActiveKey = localStorage.getItem('encryptedActiveKey');
  } catch (e) {
    throw new Error('Restore Active Key failed');
  }

  if (!encryptedActiveKey) {
    throw new Error('Active Key not found');
  }

  try {
    activeKey = CryptoJS.AES.decrypt(encryptedActiveKey, `${password}`).toString(CryptoJS.enc.Utf8);
  } catch (e) {
    throw passwordDoesNotMatchError;
  }

  if (!activeKey) {
    throw passwordDoesNotMatchError;
  }

  return activeKey;
};

export const removeEncryptedActiveKey = () => {
  try {
    localStorage.removeItem('encryptedActiveKey');
  } catch (e) {
    console.error(e);
  }
};

export const socialKeyIsExists = () => {
  try {
    const socialKey = localStorage.getItem('socialKey');
    return socialKey && socialKey.length && privateKeyIsValid(socialKey);
  } catch (e) {
    return false;
  }
};

export const saveSocialKey = (socialKey) => {
  if (!socialKey) {
    throw new Error('Active Key is required');
  }

  try {
    localStorage.setItem('socialKey', socialKey);
  } catch (e) {
    throw new Error('Save Social Key failed');
  }
};

export const restoreSocialKey = () => {
  let socialKey;

  try {
    socialKey = localStorage.getItem('socialKey');
  } catch (e) {
    throw new Error('Restore Social Key failed');
  }

  if (!privateKeyIsValid(socialKey)) {
    throw new Error('Saved Social Key is not valid');
  }

  if (!socialKey) {
    throw new Error('Social key is not found');
  }

  return socialKey;
};

export const getSocialKey = () => {
  try {
    return restoreSocialKey();
  } catch (err) {
    return null;
  }
};

export const removeSocialKey = () => {
  try {
    localStorage.removeItem('socialKey');
  } catch (err) {
    console.error(err);
  }
};

if (typeof localStorage !== 'undefined') {
  try {
    localStorage.removeItem('activeKey');
    localStorage.removeItem('brainkey');
  } catch (err) {
    console.error(err);
  }
}
