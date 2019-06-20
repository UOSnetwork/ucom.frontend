import { memoize } from 'lodash';
import api from '../api';
import {
  USERS_TEAM_STATUS_ID_CONFIRMED,
  USERS_TEAM_STATUS_ID_DECLINED,
} from '../utils/constants';

export const getOrganizationUrl = (id) => {
  if (!id) {
    return null;
  }

  return `/communities/${id}`;
};

export const getUsersTeamStatusById = memoize((id) => {
  switch (id) {
    case USERS_TEAM_STATUS_ID_CONFIRMED: {
      return 'Confirmed';
    }

    case USERS_TEAM_STATUS_ID_DECLINED: {
      return 'Declined';
    }

    default: {
      return 'Pending';
    }
  }
});

export const userIsAdmin = (user, organization) => user && organization && +organization.userId === +user.id;

export const userIsTeam = (user, organization) => {
  if (organization.usersTeam) {
    return [organization.userId, ...organization.usersTeam.map(i => i.id)].some(id => id === user.id);
  }

  return false;
};

export const validateDiscationPostUrl = async (str, organizationId) => {
  const { origin } = document.location;
  const incorrectLinkError = new Error(`Incorrect link. Format: ${origin}/posts/1`);
  let url;
  let pathnames;
  let postId;

  try {
    url = new URL(str);
    pathnames = url.pathname.split('/');
    [, , postId] = pathnames;
  } catch (e) {
    throw incorrectLinkError;
  }

  if (!(origin === url.origin && pathnames.length === 3 && pathnames[1] === 'posts' && Number.isInteger(+postId))) {
    throw incorrectLinkError;
  }

  try {
    await api.validateDiscussionsPostId(organizationId, postId);
  } catch (e) {
    throw new Error(e.response.data.errors);
  }

  return postId;
};
