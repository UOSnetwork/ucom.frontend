import { memoize } from 'lodash';
import * as overviewUtils from './overview';
import { POST_TYPE_MEDIA_ID } from './posts';
import { getBackendConfig } from './config';

const urls = {
  getMainPageUrl() {
    return '/';
  },

  getNewPostUrl() {
    return '/posts/new';
  },

  getNewOrganizationDiscussionUrl(organizationId) {
    return `/communities/${organizationId}/discussions/new`;
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

  getUserEditProfileUrl() {
    return '/profile/';
  },

  getGovernanceUrl() {
    return '/governance';
  },

  getPostUrl(post) {
    if (!post || !post.id) {
      return null;
    }

    if (post.postTypeId === POST_TYPE_MEDIA_ID) {
      return `/posts/${post.id}`;
    }

    if (post.entityNameFor && post.entityNameFor.trim() === 'org') {
      return `/communities/${post.entityIdFor}/${post.id}`;
    }

    if (post.entityIdFor) {
      return `/user/${post.entityIdFor}/${post.id}`;
    }

    return null;
  },

  getFeedPostUrl(post) {
    if (!post || !post.id || !post.entityIdFor || !post.entityNameFor) {
      return null;
    }

    if (post.entityNameFor.trim() === 'org') {
      return `/communities/${post.entityIdFor}/${post.id}`;
    }

    return `/user/${post.entityIdFor}/${post.id}`;
  },

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
    return '/communities/new';
  },

  getOrganizationEditUrl(id) {
    if (!id) {
      return null;
    }

    return `/communities/${id}/edit`;
  },

  getOverviewCategoryUrl(params = {}) {
    const filter = params.filter || overviewUtils.OVERVIEW_CATEGORIES[0].name;
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
    return `/users?page=${params.page}&sortBy=${params.sortBy}&perPage=${params.perPage}&userName=${params.userName}`;
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
};

export default urls;
