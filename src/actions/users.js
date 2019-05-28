import api from '../api';
import snakes from '../utils/snakes';
import { getToken, removeToken } from '../utils/token';
import loader from '../utils/loader';
// import { enableGtm } from '../utils/gtm';
import { addServerErrorNotification } from './notifications';
import { setUser, setUserLoading } from './';
import { siteNotificationsSetUnreadAmount } from './siteNotifications';
import { addOrganizations } from './organizations';
import graphql from '../api/graphql';
import { walletGetAccount } from './walletSimple';

export const usersAddIFollow = payload => ({ type: 'USERS_ADD_I_FOLLOW', payload });
export const usersRemoveIFollow = payload => ({ type: 'USERS_REMOVE_I_FOLLOW', payload });
export const usersAddFollowedBy = payload => ({ type: 'USERS_ADD_FOLLOWED_BY', payload });
export const usersRemoveFollowedBy = payload => ({ type: 'USERS_REMOVE_FOLLOWED_BY', payload });

export const addUsers = (data = []) => (dispatch) => {
  let users = [];
  let organizations = [];

  data.forEach((user) => {
    if (user.followedBy) {
      users = users.concat(user.followedBy);
      user.followedBy = user.followedBy.map(u => u.id);
    }

    if (user.iFollow) {
      users = users.concat(user.iFollow);
      user.iFollow = user.iFollow.map(u => u.id);
    }

    if (user.organizations) {
      organizations = organizations.concat(user.organizations);
    }

    users.push(user);
  });

  dispatch(addOrganizations(organizations));
  dispatch({ type: 'USERS_ADD', payload: users });
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
  trustedByOrderBy,
  trustedByPerPage,
  trustedByPage,
}) => async (dispatch) => {
  try {
    const data = await graphql.getUserPageData({
      userIdentity,
      trustedByOrderBy,
      trustedByPerPage,
      trustedByPage,
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

export const updateUser = payload => async (dispatch) => {
  loader.start();

  try {
    const data = await api.patchMyself(snakes(payload));

    delete data.currentRate;

    dispatch(addUsers([data]));
  } catch (e) {
    console.error(e);
    dispatch(addServerErrorNotification(e));
  }

  loader.done();
};

export const followUser = ({
  user,
  owner,
  activeKey,
}) => async (dispatch) => {
  try {
    await api.follow(user.id, getToken(), owner.accountName, user.accountName, activeKey);
    dispatch(usersAddIFollow({
      ownerId: Number(owner.id),
      userId: user.id,
    }));
    dispatch(usersAddFollowedBy({
      ownerId: Number(user.id),
      userId: owner.id,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const unfollowUser = ({
  user,
  owner,
  activeKey,
}) => async (dispatch) => {
  try {
    await api.unfollow(user.id, getToken(), owner.accountName, user.accountName, activeKey);
    dispatch(usersRemoveIFollow({
      ownerId: Number(owner.id),
      userId: user.id,
    }));
    dispatch(usersRemoveFollowedBy({
      ownerId: Number(user.id),
      userId: owner.id,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getManyUsers = ({
  airdropFilter,
  orderBy,
  page,
  perPage,
  isMyself,
}) => async (dispatch) => {
  try {
    const data = await graphql.getManyUsers({
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
