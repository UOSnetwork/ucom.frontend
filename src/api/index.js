import { WalletApi, SocialKeyApi } from 'ucom-libs-wallet';
import humps from 'lodash-humps';
import param from 'jquery-param';
import HttpActions from './HttpActions';
import { getToken } from '../utils/token';
import { getBackendConfig } from '../utils/config';
import snakes from '../utils/snakes';
import Worker from '../worker';
import { LIST_PER_PAGE } from '../utils/constants';

if (process.env.NODE_ENV === 'production') {
  WalletApi.initForProductionEnv();
} else {
  WalletApi.initForStagingEnv();
}

class Api {
  constructor() {
    this.actions = new HttpActions(getBackendConfig().httpEndpoint);
    this.uploaderActions = new HttpActions(getBackendConfig().uploaderEndpoint);
  }

  getPrivateHeaders() {
    return { Authorization: `Bearer ${getToken()}` };
  }

  async loginBySocialKey(socialKey, accountName) {
    const sign = await Worker.eccSign(accountName, socialKey);
    const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
    const response = await this.actions.post('/api/v1/auth/login', {
      sign,
      account_name: accountName,
      social_public_key: socialPublicKey,
    });

    return humps(response.data);
  }

  async loginByBrainkey(brainkey, accountName) {
    const activeKey = await Worker.getActiveKeyByBrainKey(brainkey);
    const socialKey = await Worker.getSocialKeyByActiveKey(activeKey);
    const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
    const sign = await Worker.eccSign(accountName, socialKey);
    const socialKeyIsBinded = await SocialKeyApi.getAccountCurrentSocialKey(accountName);

    if (!socialKeyIsBinded) {
      await Worker.bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey);
    } else {
      await Worker.addSocialPermissionsToEmissionAndProfile(accountName, activeKey);
    }

    try {
      await Worker.addSocialPermissionsToProposeApproveAndExecute(accountName, activeKey);
    } catch (err) {
      console.error(err);
    }

    const response = await this.actions.post('/api/v1/auth/login', snakes({ sign, accountName, socialPublicKey }));

    return humps(response.data);
  }

  async loginByActiveKey(activeKey, accountName) {
    const socialKey = await Worker.getSocialKeyByActiveKey(activeKey);
    const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
    const sign = await Worker.eccSign(accountName, socialKey);
    const socialKeyIsBinded = await SocialKeyApi.getAccountCurrentSocialKey(accountName);

    if (!socialKeyIsBinded) {
      await Worker.bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey);
    } else {
      await Worker.addSocialPermissionsToEmissionAndProfile(accountName, activeKey);
    }

    try {
      await Worker.addSocialPermissionsToProposeApproveAndExecute(accountName, activeKey);
    } catch (err) {
      console.error(err);
    }

    const response = await this.actions.post('/api/v1/auth/login', snakes({ sign, accountName, socialPublicKey }));

    return humps(response.data);
  }

  async register(brainkey, accountName, isTrackingAllowed) {
    const ownerKey = await Worker.getOwnerKeyByBrainkey(brainkey);
    const activeKey = await Worker.getActiveKeyByOwnerKey(ownerKey);
    const socialKey = await Worker.getSocialKeyByActiveKey(activeKey);
    const ownerPublicKey = await Worker.getPublicKeyByPrivateKey(ownerKey);
    const activePublicKey = await Worker.getPublicKeyByPrivateKey(activeKey);
    const socialPublicKey = await Worker.getPublicKeyByPrivateKey(socialKey);
    const sign = await Worker.eccSign(accountName, socialKey);

    const response = await this.actions.post('/api/v1/auth/registration', {
      sign,
      active_public_key: activePublicKey,
      owner_public_key: ownerPublicKey,
      social_public_key: socialPublicKey,
      is_tracking_allowed: isTrackingAllowed,
      account_name: accountName,
    });

    await Worker.bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey);
    await Worker.addSocialPermissionsToEmissionAndProfile(accountName, activeKey);
    await Worker.addSocialPermissionsToProposeApproveAndExecute(accountName, activeKey);

    return humps(response.data);
  }

  async getMyself() {
    const response = await this.actions.get('/api/v1/myself');
    const data = humps(response.data);

    // API HOT FIX https://github.com/UOSnetwork/ucom.backend/issues/84
    data.organizations.forEach(item => delete item.followedBy);

    return data;
  }

  async patchMyself(data) {
    const response = await this.actions.patch('/api/v1/myself', snakes(data));

    return humps(response.data);
  }

  async getUser(id) {
    const response = await this.actions.get(`/api/v1/users/${id}`);

    return humps(response.data);
  }

  async getUsers(params) {
    const response = await this.actions.get(`/api/v1/users?${param(snakes(params))}&v2=true`);

    return humps(response.data);
  }

  async getOrganizations(params) {
    const response = await this.actions.get(`/api/v1/organizations?${param(params)}`);

    return humps(response.data);
  }

  async searchUsers(query) {
    const response = await this.actions.get(`/api/v1/users/search/?q=${query}`);

    return humps(response.data);
  }

  async searchUsersByAccountNameWithLimit(accountName, limit = 20) {
    try {
      const query = accountName[0] === '@' ? accountName.substr(1) : accountName;
      const data = await this.searchUsers(query);
      return data.slice(0, limit);
    } catch (err) {
      return [];
    }
  }

  async createPost(data) {
    const response = await this.actions.post('/api/v1/posts', snakes(data));

    return response.data;
  }

  async repostPost(postId, data) {
    const response = await this.actions.post(`/api/v1/posts/${postId}/repost`, snakes(data));

    return response.data;
  }

  async updatePost(data, id) {
    const response = await this.actions.patch(`/api/v1/posts/${id}`, snakes(data));

    return humps(response.data);
  }

  async getPost(id) {
    const response = await this.actions.get(`/api/v1/posts/${id}`);

    return humps(response.data);
  }

  async getUserPosts(id) {
    const response = await this.actions.get(`/api/v1/users/${id}/posts`);

    return humps(response.data);
  }

  async getPosts(params) {
    const response = await this.actions.get(`/api/v1/posts?${param(snakes(params))}`);

    return humps(response.data);
  }

  async getTag(title) {
    const response = await this.actions.get(`/api/v1/tags/${title}`);

    return humps(response.data);
  }

  async getTagWallFeed({
    tagTitle,
    perPage,
    page,
    lastId,
  }) {
    const response = await this.actions.get(`/api/v1/tags/${tagTitle}/wall-feed/?page=${page}&per_page=${perPage}&last_id=${lastId}`);

    return humps(response.data);
  }

  async getTagOrgs({
    tagTitle,
    perPage,
    page,
    lastId,
  }) {
    const response = await this.actions.get(`/api/v1/tags/${tagTitle}/organizations/?page=${page}&per_page=${perPage}&last_id=${lastId}`);

    return humps(response.data);
  }

  async getTagUsers({
    tagTitle,
    perPage = LIST_PER_PAGE,
    page = 1,
    lastId,
  }) {
    const response = await this.actions.get(`/api/v1/tags/${tagTitle}/users/?&v2=true&page=${page}&per_page=${perPage}&last_id=${lastId}`);

    return humps(response.data);
  }

  async vote(isUp, postId, commentId, signedTransaction) {
    let url = `/api/v1/posts/${postId}`;

    if (commentId) {
      url = `${url}/comments/${commentId}`;
    }

    url = `${url}/${isUp ? 'upvote' : 'downvote'}`;

    const response = await this.actions.post(url, {
      signed_transaction: signedTransaction,
    });

    return humps(response.data);
  }

  async checkAccountName(accountName) {
    const response = await this.actions.post('/api/v1/auth/registration/validate-account-name', {
      account_name: accountName,
    });

    return humps(response.data);
  }

  async followUser(userId, signedTransactionJson) {
    const resp = await this.actions.post(`/api/v1/users/${userId}/follow`, {
      signed_transaction: signedTransactionJson,
    });

    return resp;
  }

  async unfollowUser(userId, signedTransactionJson) {
    const resp = await this.actions.post(`/api/v1/users/${userId}/unfollow`, {
      signed_transaction: signedTransactionJson,
    });

    return resp;
  }

  async followOrg(orgId, signedTransactionJson) {
    const response = await this.actions.post(`/api/v1/organizations/${orgId}/follow`, {
      signed_transaction: signedTransactionJson,
    });

    return response;
  }

  async unfollowOrg(orgId, signedTransactionJson) {
    const response = await this.actions.post(`/api/v1/organizations/${orgId}/unfollow`, {
      signed_transaction: signedTransactionJson,
    });

    return response;
  }

  async trustUser(userId, blockchainId, signedTransactionAsJson) {
    const response = await this.actions.post(`/api/v1/users/${userId}/trust`, {
      blockchain_id: blockchainId,
      signed_transaction: signedTransactionAsJson,
    });

    return humps(response.data);
  }

  async untrustUser(userId, blockchainId, signedTransactionAsJson) {
    const response = await this.actions.post(`/api/v1/users/${userId}/untrust`, {
      blockchain_id: blockchainId,
      signed_transaction: signedTransactionAsJson,
    });

    return humps(response.data);
  }

  async join(userId) {
    const response = await this.actions.post(`/api/v1/posts/${userId}/join`);

    return humps(response.data);
  }

  async createComment(data, postId, commentId) {
    let url = `/api/v1/posts/${postId}/comments`;

    if (commentId) {
      url = `${url}/${commentId}/comments`;
    }

    const response = await this.actions.post(url, data);

    return humps(response.data);
  }

  async updateComment(data, commentId) {
    const url = `/api/v1/posts/comments/${commentId}`;
    const response = await this.actions.patch(url, data);

    return humps(response.data);
  }

  async migrateOrganization(orgId, data) {
    const url = `/api/v1/organizations/${orgId}/migrate-to-multi-signature`;
    const response = await this.actions.post(url, snakes(data));

    return response.data;
  }

  async createOrganization(data) {
    const url = '/api/v1/organizations';
    const response = await this.actions.post(url, snakes(data));

    return response.data;
  }

  async updateOrganization(data) {
    const response = await this.actions.patch(`/api/v1/organizations/${data.id}`, snakes(data));

    return response.data;
  }

  async getOrganization(id) {
    const url = `/api/v1/organizations/${id}`;

    const response = await this.actions.get(url);

    return response.data;
  }

  async setDiscussions(organizationId, data) {
    const url = `/api/v1/organizations/${organizationId}/discussions`;
    const response = await this.actions.post(url, snakes(data));
    return humps(response.data);
  }

  async deleteAllDiscussions(organizationId) {
    const url = `/api/v1/organizations/${organizationId}/discussions`;
    const response = await this.actions.del(url);
    return humps(response.data);
  }

  async validateDiscussionsPostId(organizationId, postId) {
    const url = `/api/v1/organizations/${organizationId}/discussions/${postId}/validate`;
    const response = await this.actions.get(url);
    return humps(response.data);
  }

  async getOrganizationPosts(id) {
    const url = `/api/v1/organizations/${id}/posts`;

    const response = await this.actions.get(url);

    return humps(response.data);
  }

  async getOrganizationWallFeed({ organizationId, perPage, page }) {
    const url = `/api/v1/organizations/${organizationId}/wall-feed?per_page=${perPage}&page=${page}`;

    const response = await this.actions.get(url);

    return humps(response.data);
  }

  async searchCommunity(q) {
    const url = `/api/v1/community/search?q=${q}`;

    const response = await this.actions.get(url);

    return humps(response.data);
  }

  async searchPartnership(q) {
    const url = `/api/v1/partnership/search?q=${q}`;

    const response = await this.actions.get(url);

    return humps(response.data);
  }

  async createUserCommentPost(userId, data) {
    const url = `/api/v2/users/${userId}/posts`;
    const response = await this.actions.post(url, snakes(data));

    return humps(response.data);
  }

  async createOrganizationsCommentPost(orgId, data) {
    const url = `/api/v1/organizations/${orgId}/posts`;
    const response = await this.actions.post(url, snakes(data));

    return humps(response.data);
  }

  async getUserWallFeed({ userId, perPage, page }) {
    const response = await this.actions.get(`/api/v1/users/${userId}/wall-feed?per_page=${perPage}&page=${page}`);

    return humps(response.data);
  }

  async getUserNewsFeed({ perPage, page }) {
    const response = await this.actions.get(`/api/v1/myself/news-feed?per_page=${perPage}&page=${page}`);

    return humps(response.data);
  }

  async getNotifications(perPage, page) {
    const response = await this.actions.get(`/api/v1/myself/notifications?per_page=${perPage}&page=${page}`);

    return humps(response.data);
  }

  async confirmNotification(id) {
    const response = await this.actions.post(`/api/v1/myself/notifications/${id}/confirm`);

    return humps(response.data);
  }


  async declineNotification(id) {
    const response = await this.actions.post(`/api/v1/myself/notifications/${id}/decline`);

    return humps(response.data);
  }

  async seenNotification(id) {
    const response = await this.actions.post(`/api/v1/myself/notifications/${id}/seen`);

    return humps(response.data);
  }

  async getCurrentNetAndCpuStakedTokens(accountName) {
    const response = await WalletApi.getCurrentNetAndCpuStakedTokens(accountName);

    return humps(response);
  }

  async getApproximateRamPriceByBytesAmount(bytesAmount) {
    const response = await WalletApi.getApproximateRamPriceByBytesAmount(bytesAmount);

    return humps(response);
  }

  async getNodes() {
    const response = await this.actions.get('/api/v1/blockchain/nodes/');

    return humps(response.data);
  }

  async getTransactions(page, perPage) {
    const response = await this.actions.get(`/api/v1/myself/blockchain/transactions?per_page=${perPage}&page=${page}`);

    return humps(response.data);
  }

  async uploadOneImage(file) {
    const response = await this.uploaderActions.post('/api/v1/images/one-image', { one_image: file });

    return humps(response.data);
  }

  async getStats() {
    const response = await this.actions.get('/api/v1/stats/total');

    return humps(response.data);
  }

  async syncAccountGithub(options) {
    const response = await this.actions.post('/api/v1/users-external/users/pair', {}, options);

    return humps(response.data);
  }

  async getReferralState(eventId) {
    const data = {
      event_id: eventId,
    };

    const response = await this.actions.post('/api/v1/affiliates/actions', data);

    return humps(response.data);
  }

  async referralTransaction(signedTransaction, accountNameSource, offerId, action) {
    const data = snakes({
      signedTransaction,
      accountNameSource,
      offerId,
      action,
    });

    const response = await this.actions.post('/api/v1/affiliates/referral-transaction', data);

    return humps(response.data);
  }

  async registrationProfile(signedTransaction, userCreatedAt) {
    const data = snakes({ signedTransaction, userCreatedAt });
    const response = await this.actions.post('/api/v1/myself/transactions/registration-profile', data);

    return humps(response.data);
  }

  async validateAccountName(accountName) {
    const data = snakes({ accountName });
    const response = await this.actions.post('/api/v1/auth/validate-account-name', data);

    return humps(response.data);
  }
}

export { default as graphql } from './graphql';
export default new Api();
