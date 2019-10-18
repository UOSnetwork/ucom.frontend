import { isNull, isEqual } from 'lodash';
import api from '../api';
import { setUser, setUserLoading } from './';
import { siteNotificationsSetUnreadAmount } from './siteNotifications';
import { addOrganizations } from './organizations';
import graphql from '../api/graphql';
import { getUserById, getUsersByIds } from '../store/users';
import Worker from '../worker';
import { getSocialKey, getToken, removeToken, USER_EDITABLE_PROPS, TRANSACTION_PERMISSION_SOCIAL } from '../utils';
import { selectOwner } from '../store';
import { authShowPopup } from './auth';
import { addErrorNotificationFromResponse } from './notifications';

export const addUsers = (data = []) => (dispatch) => {
  let users = [];
  let organizations = [];

  data.forEach((user) => {
    // TODO: Remove when backend remove this field from response
    if (isNull(user.followedBy)) {
      delete user.followedBy;
    }

    if (isNull(user.iFollow)) {
      delete user.iFollow;
    }

    if (isNull(user.myselfData)) {
      delete user.myselfData;
    }
    // End remove

    if (user.followedBy) {
      users = users.concat(user.followedBy);
      user.followedBy = user.followedBy.map(i => i.id);
    }

    if (user.iFollow) {
      users = users.concat(user.iFollow);
      user.iFollow = user.iFollow.map(i => i.id);
    }

    if (user.organizations) {
      organizations = organizations.concat(user.organizations);
      user.organizations = user.organizations.map(i => i.id);
    }

    users.push(user);
  });

  if (data.length) {
    dispatch(addOrganizations(organizations));
    users.forEach((user) => {
      getUserById.cache.delete(user.id);
      getUserById.cache.delete(user.accountName);
    });
    getUsersByIds.cache.clear();
    dispatch({ type: 'USERS_ADD', payload: users });
  }
};

export const fetchMyself = () => async (dispatch) => {
  const token = getToken();

  if (!token) {
    return undefined;
  }
  let data;
  dispatch(setUserLoading(true));

  try {
    data = await api.getMyself(token);

    dispatch(addUsers([data]));
    dispatch(setUser(data));
    dispatch(siteNotificationsSetUnreadAmount(data.unreadMessagesCount));
  } catch (e) {
    console.error(e);
    removeToken();
  }

  dispatch(setUserLoading(false));

  return data;
};

export const fetchUser = userIdentity => async (dispatch) => {
  const data = await graphql.fetchUser({ userIdentity });

  dispatch(addUsers([data]));

  return data;
};

export const fetchUserPageData = ({ userIdentity }) => async (dispatch) => {
  const data = await graphql.getUserPageData({
    userIdentity,
  });
  const { oneUser, oneUserTrustedBy, oneUserFollowsOrganizations } = data;

  dispatch(addUsers(oneUserTrustedBy.data.concat([oneUser])));
  dispatch(addOrganizations(oneUserFollowsOrganizations.data));

  return data;
};

export const fetchUserTrustedBy = ({
  userIdentity, orderBy, perPage, page,
}) => async (dispatch) => {
  const data = await graphql.getUserTrustedBy({
    userIdentity, orderBy, perPage, page,
  });

  dispatch(addUsers(data.data));

  return data;
};

export const fetchUserFollowsOrganizations = ({
  userIdentity, orderBy, perPage, page,
}) => async (dispatch) => {
  const data = await graphql.getUserFollowsOrganizations({
    userIdentity, orderBy, perPage, page,
  });

  dispatch(addOrganizations(data.data));

  return data;
};

export const updateUser = userData => async (dispatch) => {
  let dataAsJson;
  const socialKey = getSocialKey();

  if (!socialKey) {
    throw new Error('Social key is required');
  }

  if (!isEqual(Object.keys(userData), USER_EDITABLE_PROPS)) {
    throw new Error('UserData must contain all editable props');
  }

  // Remove lastName for old profiles
  userData.lastName = '';

  try {
    dataAsJson = JSON.stringify(userData);
  } catch (err) {
    throw new Error('UserData object is not valid');
  }

  const signedTransaction = await Worker.updateProfile(userData.accountName, socialKey, dataAsJson, TRANSACTION_PERMISSION_SOCIAL);

  const dataForApi = {
    ...userData,
    entityImages: JSON.stringify(userData.entityImages),
    signedTransaction: JSON.stringify(signedTransaction),
  };

  await api.patchMyself(dataForApi);
  await dispatch(fetchUser(userData.id));
};

export const getManyUsersAirdrop = ({
  airdropFilter, orderBy, page, perPage, isMyself,
}) => async (dispatch) => {
  const data = await graphql.getManyUsersAirdrop({
    airdropFilter, orderBy, page, perPage, isMyself,
  });

  dispatch(addUsers([data]));

  return data;
};

export const getOwnerCredentialsOrShowAuthPopup = () => (dispatch, getState) => {
  const state = getState();
  const socialKey = getSocialKey();
  const owner = selectOwner(state);

  if (!owner || !owner.id || !owner.accountName || !socialKey) {
    dispatch(authShowPopup());
    return null;
  }

  return {
    socialKey,
    id: owner.id,
    accountName: owner.accountName,
  };
};

export const trustUserOrShowErrorNotification = (userId, userAccountName) => async (dispatch) => {
  try {
    const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

    if (!ownerCredentials) {
      return;
    }


    const { blockchain_id, signed_transaction } = await Worker.getTrustUserWithAutoUpdateSignedTransaction(
      ownerCredentials.accountName,
      ownerCredentials.socialKey,
      userAccountName,
      TRANSACTION_PERMISSION_SOCIAL,
    );

    await api.trustUser(userId, blockchain_id, JSON.stringify(signed_transaction));
    await dispatch(fetchUser(userId));
  } catch (err) {
    dispatch(addErrorNotificationFromResponse(err));
  }
};

export const untrustUserOrShowErrorNotification = (userId, userAccountName) => async (dispatch) => {
  try {
    const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

    if (!ownerCredentials) {
      return;
    }

    const { blockchain_id, signed_transaction } = await Worker.getUntrustUserWithAutoUpdateSignedTransaction(
      ownerCredentials.accountName,
      ownerCredentials.socialKey,
      userAccountName,
      TRANSACTION_PERMISSION_SOCIAL,
    );

    await api.untrustUser(userId, blockchain_id, JSON.stringify(signed_transaction));
    await dispatch(fetchUser(userId));
  } catch (err) {
    dispatch(addErrorNotificationFromResponse(err));
  }
};
