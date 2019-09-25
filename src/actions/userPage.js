import graphql from '../api/graphql';
import { addUsers } from './users';
import { addOrganizations } from './organizations';

export const reset = () => ({ type: 'USER_PAGE_RESET' });

export const setData = payload => ({ type: 'USER_PAGE_SET_DATA', payload });

export const getPageData = userIdentity => async (dispatch) => {
  try {
    const result = await graphql.getUserPageData({ userIdentity });
    const {
      user, orgs, iFollow, followedBy, trustedBy,
    } = result;

    dispatch(addUsers([
      user,
      ...iFollow.data,
      ...followedBy.data,
      ...trustedBy.data,
    ]));

    dispatch(addOrganizations(orgs.data));

    dispatch(setData({
      userIdentity,
      trustedBy: {
        ids: trustedBy.data.map(i => i.id),
        metadata: trustedBy.metadata,
      },
      trustedByPopup: {
        ids: trustedBy.data.map(i => i.id),
        metadata: trustedBy.metadata,
      },
      orgs: {
        ids: orgs.data.map(i => i.id),
        metadata: orgs.metadata,
      },
      orgsPopup: {
        ids: orgs.data.map(i => i.id),
        metadata: orgs.metadata,
      },
      iFollow: {
        ids: iFollow.data.map(i => i.id),
        metadata: iFollow.metadata,
      },
      iFollowPopup: {
        ids: iFollow.data.map(i => i.id),
        metadata: iFollow.metadata,
      },
      followedBy: {
        ids: followedBy.data.map(i => i.id),
        metadata: followedBy.metadata,
      },
      followedByPopup: {
        ids: followedBy.data.map(i => i.id),
        metadata: followedBy.metadata,
      },
      loaded: true,
    }));

    return result;
  } catch (err) {
    console.error(err);

    dispatch(setData({
      loaded: true,
    }));
    throw err;
  }
};

export const getTrustedBy = userIdentity => async (dispatch) => {
  const { data, metadata } = await graphql.getUserTrustedBy({
    userIdentity,
  });

  dispatch(addUsers(data));

  dispatch(setData({
    trustedByPopup: {
      ids: data.map(i => i.id),
      metadata,
    },
    trustedBy: {
      ids: data.map(i => i.id),
      metadata,
    },
  }));
};

export const getTrustedByPopup = (userIdentity, page) => async (dispatch) => {
  const { data, metadata } = await graphql.getUserTrustedBy({
    userIdentity,
    page,
  });

  dispatch(addUsers(data));

  dispatch(setData({
    trustedByPopup: {
      metadata,
      ids: data.map(i => i.id),
    },
    trustedBy: {
      metadata,
    },
  }));
};

export const getOrgsPopup = (userIdentity, page) => async (dispatch) => {
  const { data, metadata } = await graphql.getUserFollowsOrganizations({
    userIdentity,
    page,
  });

  dispatch(addOrganizations(data));

  dispatch(setData({
    orgsPopup: {
      ids: data.map(i => i.id),
      metadata,
    },
    orgs: {
      metadata,
    },
  }));
};

export const getIFollowPopup = (userIdentity, page) => async (dispatch) => {
  const { data, metadata } = await graphql.getUserIFollow({
    userIdentity,
    page,
  });

  dispatch(addUsers(data));

  dispatch(setData({
    iFollowPopup: {
      ids: data.map(i => i.id),
      metadata,
    },
    iFollow: {
      metadata,
    },
  }));
};

export const getFollowedByPopup = (userIdentity, page) => async (dispatch) => {
  const { data, metadata } = await graphql.getUserFollowedBy({
    userIdentity,
    page,
  });

  dispatch(addUsers(data));

  dispatch(setData({
    followedByPopup: {
      ids: data.map(i => i.id),
      metadata,
    },
    followedBy: {
      metadata,
    },
  }));
};
