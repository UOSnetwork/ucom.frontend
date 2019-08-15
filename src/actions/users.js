import { isNull, isEqual } from 'lodash';
import { ContentApi } from 'ucom-libs-wallet';
import api from '../api';
import { getToken, removeToken } from '../utils/token';
import loader from '../utils/loader';
import { setUser, setUserLoading } from './';
import { siteNotificationsSetUnreadAmount } from './siteNotifications';
import { addOrganizations } from './organizations';
import graphql from '../api/graphql';
import { walletGetAccount } from './walletSimple';
import { restoreActiveKey } from '../utils/keys';
import { USER_EDITABLE_PROPS } from '../utils/constants';
// import { enableGtm } from '../utils/gtm';
import { getUserById, getUsersByIds } from '../store/users';

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
    users.forEach(user => getUserById.cache.delete(user.id));
    getUsersByIds.cache.clear();

    dispatch(addOrganizations(organizations));
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

    dispatch(setUser(data));
    dispatch(addUsers([data]));
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
  try {
    const data = await graphql.fetchUser({ userIdentity });
    dispatch(addUsers([data]));
    return data;
  } catch (e) {
    throw e;
  }
};

export const fetchUserPageData = ({
  userIdentity,
}) => async (dispatch) => {
  try {
    const data = await graphql.getUserPageData({
      userIdentity,
    });
    const { oneUser, oneUserTrustedBy, oneUserFollowsOrganizations } = data;

    dispatch(addUsers(oneUserTrustedBy.data.concat([oneUser])));
    dispatch(addOrganizations(oneUserFollowsOrganizations.data));
    return data;
  } catch (e) {
    throw e;
  }
};

export const fetchUserTrustedBy = ({
  userIdentity,
  orderBy,
  perPage,
  page,
}) => async (dispatch) => {
  try {
    const data = await graphql.getUserTrustedBy({
      userIdentity,
      orderBy,
      perPage,
      page,
    });
    dispatch(addUsers(data.data));
    return data;
  } catch (e) {
    throw e;
  }
};

export const fetchUserFollowsOrganizations = ({
  userIdentity,
  orderBy,
  perPage,
  page,
}) => async (dispatch) => {
  try {
    const data = await graphql.getUserFollowsOrganizations({
      userIdentity,
      orderBy,
      perPage,
      page,
    });
    dispatch(addOrganizations(data.data));
    return data;
  } catch (e) {
    throw e;
  }
};

export const updateUser = userData => async (dispatch) => {
  let dataAsJson;
  const activeKey = restoreActiveKey();

  if (!activeKey) {
    throw new Error('Active key is required');
  }

  if (!isEqual(Object.keys(userData), USER_EDITABLE_PROPS)) {
    throw new Error('UserData must contain all editable props');
  }

  try {
    dataAsJson = JSON.stringify(userData);
  } catch (err) {
    throw new Error('UserData object is not valid');
  }

  try {
    const signedTransaction = await ContentApi.updateProfile(userData.accountName, activeKey, dataAsJson);

    const dataForApi = {
      ...userData,
      entityImages: JSON.stringify(userData.entityImages),
      signedTransaction: JSON.stringify(signedTransaction),
    };

    await api.patchMyself(dataForApi);
    dispatch(fetchUser(userData.id));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getManyUsersAirdrop = ({
  airdropFilter,
  orderBy,
  page,
  perPage,
  isMyself,
}) => async (dispatch) => {
  try {
    const data = await graphql.getManyUsersAirdrop({
      airdropFilter,
      orderBy,
      page,
      perPage,
      isMyself,
    });
    dispatch(addUsers([data]));
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const trustUser = ({
  userId,
  userAccountName,
  ownerAccountName,
  activeKey,
}) => async (dispatch) => {
  try {
    await api.trustUser(
      ownerAccountName,
      userAccountName,
      userId,
      activeKey,
    );
    dispatch({
      type: 'USERS_SET_TRUST',
      payload: {
        userId,
        trust: true,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const untrustUser = ({
  userId,
  userAccountName,
  ownerAccountName,
  activeKey,
}) => async (dispatch) => {
  try {
    await api.untrustUser(
      ownerAccountName,
      userAccountName,
      userId,
      activeKey,
    );
    dispatch({
      type: 'USERS_SET_TRUST',
      payload: {
        userId,
        trust: false,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
