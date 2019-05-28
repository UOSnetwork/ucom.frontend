import api from '../api';
import {
  SOURCES_ID_FACEBOOK,
  SOURCES_ID_REDDIT,
  SOURCES_ID_MEDIUM,
  SOURCES_ID_TWITTER,
  SOURCES_ID_GITHUB,
  USERS_TEAM_STATUS_ID_PENDING,
  USERS_TEAM_STATUS_ID_CONFIRMED,
  USERS_TEAM_STATUS_ID_DECLINED,
} from '../store/organization';

export const getOrganizationUrl = (id) => {
  if (!id) {
    return null;
  }

  return `/communities/${id}`;
};

export const getSourceNameById = (id) => {
  switch (id) {
    case SOURCES_ID_FACEBOOK: {
      return 'Facebook';
    }

    case SOURCES_ID_REDDIT: {
      return 'Reddit';
    }

    case SOURCES_ID_MEDIUM: {
      return 'Medium';
    }

    case SOURCES_ID_TWITTER: {
      return 'Twitter';
    }

    case SOURCES_ID_GITHUB: {
      return 'Github';
    }
    default: {
      return null;
    }
  }
};

export const getUsersTeamStatusById = (id) => {
  switch (id) {
    case USERS_TEAM_STATUS_ID_PENDING: {
      return 'Pending';
    }

    case USERS_TEAM_STATUS_ID_CONFIRMED: {
      return 'Confirmed';
    }

    case USERS_TEAM_STATUS_ID_DECLINED: {
      return 'Declined';
    }

    default: {
      return null;
    }
  }
};

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
