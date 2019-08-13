import { SocialApi } from 'ucom-libs-wallet';
import api from '../api';
import { fetchUser } from './users';
import { getOrganization } from './organizations';

export const followUser = (ownerAccountName, userId, userAccountName, privateKey) => async (dispatch) => {
  try {
    const signedTransactionObject = await SocialApi.getFollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName);
    const signedTransactionJson = JSON.stringify(signedTransactionObject);
    await api.followUser(userId, signedTransactionJson);
    await dispatch(fetchUser(userId));
  } catch (err) {
    throw err;
  }
};

export const unfollowUser = (ownerAccountName, userId, userAccountName, privateKey) => async (dispatch) => {
  try {
    const signedTransactionObject = await SocialApi.getUnfollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName);
    const signedTransactionJson = JSON.stringify(signedTransactionObject);
    await api.unfollowUser(userId, signedTransactionJson);
    await dispatch(fetchUser(userId));
  } catch (err) {
    throw err;
  }
};

export const followOrg = (ownerAccountName, privateKey, orgBlockchainId, orgId) => async (dispatch) => {
  try {
    const signedTransactionObject = await SocialApi.getFollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId);
    const signedTransactionJson = JSON.stringify(signedTransactionObject);
    await api.followOrg(orgId, signedTransactionJson);
    await dispatch(getOrganization(orgId));
  } catch (err) {
    throw err;
  }
};

export const unfollowOrg = (ownerAccountName, privateKey, orgBlockchainId, orgId) => async (dispatch) => {
  try {
    const signedTransactionObject = await SocialApi.getUnfollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId);
    const signedTransactionJson = JSON.stringify(signedTransactionObject);
    await api.unfollowOrg(orgId, signedTransactionJson);
    await dispatch(getOrganization(orgId));
  } catch (err) {
    throw err;
  }
};
