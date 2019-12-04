import { memoize } from 'lodash';
import * as overviewUtils from './overview';
import { POST_TYPE_MEDIA_ID } from './constants';
import { getBackendConfig, getBaseUrl } from './config';

const urls = {
  getDirectUrl(path) {
    return `${getBaseUrl()}${path}`;
  },

  getMainPageUrl() {
    return '/';
  },

  getNewPostUrl() {
    return '/posts/new';
  },

  getNewOrganizationDiscussionUrl(organizationId) {
    return `/posts/new?organizationId=${organizationId}`;
  },

  getTagUrl(tag) {
    return `/tags/${tag}`;
  },

  getRegistrationUrl() {
    return '/registration';
  },

  getUserUrl(userId) {
    if (!userId) {
      return null;
    }

    return `/user/${userId}`;
  },

  getUserEditProfileUrl(userId) {
    return `/user/${userId}/profile`;
  },

  getGovernanceUrl() {
    return '/governance';
  },

  getGovernanceVotingUrl(id) {
    return `${urls.getGovernanceUrl()}/${id}`;
  },

  getGovernanceCastUrl(id) {
    return `${urls.getGovernanceVotingUrl(id)}/cast`;
  },

  getPublicationUrl(postId) {
    if (!postId) {
      return null;
    }

    return `/posts/${postId}`;
  },

  getPostUrl: memoize(({
    id, postTypeId, entityNameFor, entityIdFor,
  } = {}) => {
    if (!id) {
      return null;
    }

    if ((!postTypeId && !entityNameFor && !entityIdFor) || postTypeId === POST_TYPE_MEDIA_ID) {
      return `/posts/${id}`;
    }

    if (entityNameFor && entityNameFor.trim() === 'org' && entityIdFor) {
      return `/communities/${entityIdFor}/${id}`;
    }

    if (entityIdFor) {
      return `/user/${entityIdFor}/${id}`;
    }

    return null;
  }, params => Object.values(params).join()),

  getFeedPostUrl: memoize(({
    id, entityIdFor, entityNameFor,
  } = {}) => {
    if (!id || !entityIdFor || !entityNameFor) {
      return null;
    }

    if (entityNameFor.trim() === 'org') {
      return `/communities/${entityIdFor}/${id}`;
    }

    return `/user/${entityIdFor}/${id}`;
  }, params => Object.values(params).join()),

  getPostEditUrl(postId) {
    if (!postId) {
      return null;
    }

    return `/posts/${postId}/edit`;
  },

  getOrganizationUrl(id) {
    if (!id) {
      return null;
    }

    return `/communities/${id}`;
  },

  getOrganizationCrerateUrl() {
    return '#new-community';
  },

  getOrganizationEditUrl(id) {
    if (!id) {
      return null;
    }

    return `/communities/${id}/profile`;
  },

  getOverviewCategoryUrl(params = {}) {
    // const filter = params.filter || overviewUtils.OVERVIEW_CATEGORIES[0].name;
    const filter = params.filter || 'top';
    const route = params.route || overviewUtils.OVERVIEW_ROUTES[0].name;
    const { page } = params;
    let url = `/overview/${route}/filter/${filter}`;

    if (page) {
      url = `${url}/page/${page}`;
    }

    return url;
  },

  getPublicationsUrl() {
    return '/overview/publications';
  },

  getFileUrl: memoize((filename) => {
    if (!filename) {
      return null;
    }

    if (filename.indexOf('http://') > -1 || filename.indexOf('https://') > -1) {
      return filename;
    }

    return `${getBackendConfig().httpEndpoint}/upload/${filename}`;
  }),

  getUsersUrl() {
    return '/users';
  },

  getUsersPagingUrl(params) {
    const defaultParams = {
      page: 1,
      orderBy: '-current_rate',
      perPage: 20,
    };

    const mergedParams = {
      ...defaultParams,
      ...params,
    };

    return `/users?page=${mergedParams.page}&orderBy=${mergedParams.orderBy}&perPage=${mergedParams.perPage}&userName=${mergedParams.userName}`;
  },

  getSourceUrl(source) {
    if (!source) {
      return null;
    }

    if (source.sourceUrl) {
      return source.sourceUrl;
    }

    if (source.entityName.trim() === 'users') {
      return urls.getUserUrl(source.entityId);
    }

    return urls.getOrganizationUrl(source.entityId);
  },

  getSettingsUrl(prefix = '') {
    return `${prefix}#settings`;
  },

  getFaqUrl() {
    return '/faq';
  },
};

export default urls;
