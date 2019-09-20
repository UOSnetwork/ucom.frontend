import { isNull, isEqual } from 'lodash';
import api from '../api';
import { getToken, removeToken } from '../utils/token';
import loader from '../utils/loader';
import { setUser, setUserLoading } from './';
import { siteNotificationsSetUnreadAmount } from './siteNotifications';
import { addOrganizations } from './organizations';
import graphql from '../api/graphql';
import { walletGetAccount } from './wallet';
import { getSocialKey } from '../utils/keys';
import { USER_EDITABLE_PROPS, TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';
// import { enableGtm } from '../utils/gtm';
import { getUserById, getUsersByIds } from '../store/users';
import Worker from '../worker';

export const addUsers = (data = []) => (dispatch) => {
  let users = [];
  let organizations = [];

  data.forEach((user) => {
    // TODO: Remove when backend remove this field from response
    if (isNull(user.followedBy)) {
      delete user.followedBy;
    }

    // TODO: Remove when backend remove this field from response
    if (isNull(user.iFollow)) {
      delete user.iFollow;
    }

    // TODO: Remove when backend remove this field from response
    if (isNull(user.myselfData)) {
      delete user.myselfData;
    }

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
    users.forEach(user => getUserById.cache.delete(user.id));
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
  loader.start();

  try {
    data = await api.getMyself(token);

    dispatch(addUsers([data]));
    dispatch(setUser(data));
    dispatch(siteNotificationsSetUnreadAmount(data.unreadMessagesCount));
    dispatch(walletGetAccount(data.accountName));

    // TODO: Сделать disable
    // if (process.env.NODE_ENV === 'production' && data.isTrackingAllowed) {
    //   enableGtm();
    // }
  } catch (e) {
    console.error(e);
    removeToken();
  }

  dispatch(setUserLoading(false));
  loader.done();

  return data;
};

export const fetchUser = userIdentity => async (dispatch) => {
  const data = await graphql.fetchUser({ userIdentity });

  dispatch(addUsers([data]));

  return data;
};

export const fetchUserPageData = ({
  userIdentity,
}) => async (dispatch) => {
  const data = await graphql.getUserPageData({
    userIdentity,
  });
  const { oneUser, oneUserTrustedBy, oneUserFollowsOrganizations } = data;

  dispatch(addUsers(oneUserTrustedBy.data.concat([oneUser])));
  dispatch(addOrganizations(oneUserFollowsOrganizations.data));

  return data;
};

export const fetchUserTrustedBy = ({
  userIdentity,
  orderBy,
  perPage,
  page,
}) => async (dispatch) => {
  const data = await graphql.getUserTrustedBy({
    userIdentity,
    orderBy,
    perPage,
    page,
  });

  dispatch(addUsers(data.data));

  return data;
};

export const fetchUserFollowsOrganizations = ({
  userIdentity,
  orderBy,
  perPage,
  page,
}) => async (dispatch) => {
  const data = await graphql.getUserFollowsOrganizations({
    userIdentity,
    orderBy,
    perPage,
    page,
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
  airdropFilter,
  orderBy,
  page,
  perPage,
  isMyself,
}) => async (dispatch) => {
  const data = await graphql.getManyUsersAirdrop({
    airdropFilter,
    orderBy,
    page,
    perPage,
    isMyself,
  });

  dispatch(addUsers([data]));

  return data;
};

export const trustUser = ({
  userId,
  userAccountName,
  ownerAccountName,
  socialKey,
}) => async (dispatch) => {
  await api.trustUser(
    ownerAccountName,
    userAccountName,
    userId,
    socialKey,
  );

  dispatch({
    type: 'USERS_SET_TRUST',
    payload: {
      userId,
      trust: true,
    },
  });
};

export const untrustUser = ({
  userId,
  userAccountName,
  ownerAccountName,
  socialKey,
}) => async (dispatch) => {
  await api.untrustUser(
    ownerAccountName,
    userAccountName,
    userId,
    socialKey,
  );

  dispatch({
    type: 'USERS_SET_TRUST',
    payload: {
      userId,
      trust: false,
    },
  });
};
