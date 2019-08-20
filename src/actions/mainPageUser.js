import graphql from '../api/graphql';
import { addPosts } from './posts';
import { addOrganizations } from './organizations';
import { addUsers } from './users';
import { LIST_ORDER_BY_RATE, LIST_PER_PAGE } from '../utils/constants';

export const setData = payload => ({ type: 'MAIN_PAGE_USER_SET_DATA', payload });

export const getPageData = userIdentity => async (dispatch) => {
  const {
    posts, orgs, users,
  } = await graphql.getUserMainPageData({ userIdentity });

  dispatch(addPosts(posts.data));
  dispatch(addOrganizations(orgs.data));
  dispatch(addUsers(users.data));
  dispatch(setData({
    orgs: {
      ids: orgs.data.map(org => org.id),
      metadata: orgs.metadata,
    },
    orgsPopup: {
      ids: orgs.data.map(org => org.id),
      metadata: orgs.metadata,
    },
    users: {
      ids: users.data.map(org => org.id),
      metadata: users.metadata,
    },
    usersPopup: {
      ids: users.data.map(org => org.id),
      metadata: users.metadata,
    },
    topPostsIds: posts.data.map(post => post.id),
  }));
};

export const getOrganizations = (userIdentity, page) => async (dispatch) => {
  const result = await graphql.getUserFollowsOrganizations({
    userIdentity,
    page,
    perPage: LIST_PER_PAGE,
    orderBy: LIST_ORDER_BY_RATE,
  });

  dispatch(addOrganizations(result.data));
  dispatch(setData({
    orgsPopup: {
      ids: result.data.map(i => i.id),
      metadata: result.metadata,
    },
  }));
};

export const getUsers = (userIdentity, page) => async (dispatch) => {
  const result = await graphql.getUserIFollow({
    userIdentity,
    page,
    perPage: LIST_PER_PAGE,
    orderBy: LIST_ORDER_BY_RATE,
  });

  dispatch(addUsers(result.data));
  dispatch(setData({
    usersPopup: {
      ids: result.data.map(i => i.id),
      metadata: result.metadata,
    },
  }));
};
