import api from '../api';
import { fetchUser } from './users';
import { getOrganization } from './organizations';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';
import Worker from '../worker';

export const followUser = (ownerAccountName, userId, userAccountName, privateKey) => async (dispatch) => {
  const signedTransactionObject = await Worker.getFollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName, TRANSACTION_PERMISSION_SOCIAL);
  const signedTransactionJson = JSON.stringify(signedTransactionObject);

  await api.followUser(userId, signedTransactionJson);
  await dispatch(fetchUser(userId));
};

export const unfollowUser = (ownerAccountName, userId, userAccountName, privateKey) => async (dispatch) => {
  const signedTransactionObject = await Worker.getUnfollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName, TRANSACTION_PERMISSION_SOCIAL);
  const signedTransactionJson = JSON.stringify(signedTransactionObject);

  await api.unfollowUser(userId, signedTransactionJson);
  await dispatch(fetchUser(userId));
};

export const followOrg = (ownerAccountName, privateKey, orgBlockchainId, orgId) => async (dispatch) => {
  const signedTransactionObject = await Worker.getFollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, TRANSACTION_PERMISSION_SOCIAL);
  const signedTransactionJson = JSON.stringify(signedTransactionObject);

  await api.followOrg(orgId, signedTransactionJson);
  await dispatch(getOrganization(orgId));
};

export const unfollowOrg = (ownerAccountName, privateKey, orgBlockchainId, orgId) => async (dispatch) => {
  const signedTransactionObject = await Worker.getUnfollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, TRANSACTION_PERMISSION_SOCIAL);
  const signedTransactionJson = JSON.stringify(signedTransactionObject);

  await api.unfollowOrg(orgId, signedTransactionJson);
  await dispatch(getOrganization(orgId));
};
