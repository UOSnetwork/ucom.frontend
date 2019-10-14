import api from '../api';
import { fetchUser, getOwnerCredentialsOrShowAuthPopup } from './users';
import { getOrganization } from './organizations';
import { PERMISSION_SOCIAL } from '../utils/constants';
import { scatter } from '../utils/Scatter';
import { selectUserById } from '../store';
import Worker from '../worker';

export const followOrUnfollowUser = (userId, isFollow) => async (dispatch, getState) => {
  let signedTransaction;
  const state = getState();
  const user = selectUserById(userId)(state);

  if (!user) {
    throw new Error('User not found');
  }

  if (scatter.isConnected()) {
    try {
      signedTransaction = await scatter.getFollowOrUnfollowAccountSignedTransaction(user.accountName, isFollow);
    } catch (err) {
      console.error(err);
    }
  }

  if (!signedTransaction) {
    const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());
    const signFn = isFollow ? Worker.getFollowAccountSignedTransaction : Worker.getUnfollowAccountSignedTransaction;

    if (!ownerCredentials) {
      return;
    }

    signedTransaction = await signFn(ownerCredentials.accountName, ownerCredentials.socialKey, user.accountName, PERMISSION_SOCIAL);
  }

  const apiFn = isFollow ? api.followUser.bind(api) : api.unfollowUser.bind(api);

  await apiFn(userId, JSON.stringify(signedTransaction));
  await dispatch(fetchUser(userId));
};

export const followOrg = (ownerAccountName, privateKey, orgBlockchainId, orgId) => async (dispatch) => {
  const signedTransactionObject = await Worker.getFollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, PERMISSION_SOCIAL);
  const signedTransactionJson = JSON.stringify(signedTransactionObject);

  await api.followOrg(orgId, signedTransactionJson);
  await dispatch(getOrganization(orgId));
};

export const unfollowOrg = (ownerAccountName, privateKey, orgBlockchainId, orgId) => async (dispatch) => {
  const signedTransactionObject = await Worker.getUnfollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, PERMISSION_SOCIAL);
  const signedTransactionJson = JSON.stringify(signedTransactionObject);

  await api.unfollowOrg(orgId, signedTransactionJson);
  await dispatch(getOrganization(orgId));
};
