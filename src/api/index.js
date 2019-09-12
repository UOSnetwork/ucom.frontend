import { WalletApi, SocialApi, Dictionary, SocialKeyApi } from 'ucom-libs-wallet';
import ecc from 'eosjs-ecc';
import humps from 'lodash-humps';
import param from 'jquery-param';
import HttpActions from './HttpActions';
import { getToken } from '../utils/token';
import { getActivePrivateKey, getOwnerPublicKeyByBrainkey, getPublicKeyByPrivateKey, getSocialPrivateKeyByActiveKey } from '../utils/keys';
import { getBackendConfig } from '../utils/config';
import snakes from '../utils/snakes';
import { LIST_PER_PAGE, TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';

const BLOCK_PRODUCERS = Dictionary.BlockchainNodes.typeBlockProducer();
const CALCULATOR_NODES = Dictionary.BlockchainNodes.typeCalculator();

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

  async login({ brainkey, account_name }) {
    const activePrivateKey = getActivePrivateKey(brainkey);
    const socialPrivateKey = getSocialPrivateKeyByActiveKey(activePrivateKey);
    const socialPublicKey = getPublicKeyByPrivateKey(socialPrivateKey);
    const sign = ecc.sign(account_name, socialPrivateKey);

    const socialKeyIsBinded = await SocialKeyApi.getAccountCurrentSocialKey(account_name);

    if (!socialKeyIsBinded) {
      await SocialKeyApi.bindSocialKeyWithSocialPermissions(account_name, activePrivateKey, socialPublicKey);
    } else {
      await SocialKeyApi.addSocialPermissionsToEmissionAndProfile(account_name, activePrivateKey);
    }

    const response = await this.actions.post('/api/v1/auth/login', {
      sign,
      account_name,
      social_public_key: socialPublicKey,
    });

    return humps(response.data);
  }

  async register(brainkey, accountName, isTrackingAllowed) {
    const ownerPublicKey = getOwnerPublicKeyByBrainkey(brainkey);
    const activePrivateKey = getActivePrivateKey(brainkey);
    const activePublicKey = getPublicKeyByPrivateKey(activePrivateKey);
    const socialPrivateKey = getSocialPrivateKeyByActiveKey(activePrivateKey);
    const socialPublicKey = getPublicKeyByPrivateKey(socialPrivateKey);
    const sign = ecc.sign(accountName, socialPrivateKey);

    const response = await this.actions.post('/api/v1/auth/registration', {
      sign,
      active_public_key: activePublicKey,
      owner_public_key: ownerPublicKey,
      social_public_key: socialPublicKey,
      is_tracking_allowed: isTrackingAllowed,
      account_name: accountName,
    });

    await SocialKeyApi.bindSocialKeyWithSocialPermissions(accountName, activePrivateKey, socialPublicKey);
    await SocialKeyApi.addSocialPermissionsToEmissionAndProfile(accountName, activePrivateKey);

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

  // TODO: Move sign transaction to redux action
  async trustUser(ownerAccountName, userAccountName, userId, ownerPrivateKey) {
    const signedTransaction = await SocialApi.getTrustUserSignedTransactionsAsJson(
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      TRANSACTION_PERMISSION_SOCIAL,
    );
    const response = await this.actions.post(`/api/v1/users/${userId}/trust`, {
      signed_transaction: signedTransaction,
    });

    return humps(response.data);
  }

  // TODO: Move sign transaction to redux action
  async untrustUser(ownerAccountName, userAccountName, userId, ownerPrivateKey) {
    const signedTransaction = await SocialApi.getUnTrustUserSignedTransactionsAsJson(
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      TRANSACTION_PERMISSION_SOCIAL,
    );
    const response = await this.actions.post(`/api/v1/users/${userId}/untrust`, {
      signed_transaction: signedTransaction,
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

  async getAccountState(accountName) {
    const response = await WalletApi.getAccountState(accountName);

    return humps(response);
  }

  async getAccountBalance(accountName, symbol) {
    const response = await WalletApi.getAccountBalance(accountName, symbol);

    return humps(response);
  }

  async sendTokens(accountNameFrom, accountNameTo, amount, memo, privateKey) {
    const response = await WalletApi.sendTokens(accountNameFrom, privateKey, accountNameTo, amount, memo);

    return humps(response);
  }

  async stakeOrUnstakeTokens(accountName, netAmount, cpuAmount, privateKey) {
    const response = await WalletApi.stakeOrUnstakeTokens(
      accountName,
      privateKey,
      netAmount,
      cpuAmount,
    );

    return humps(response);
  }

  async getCurrentNetAndCpuStakedTokens(accountName) {
    const response = await WalletApi.getCurrentNetAndCpuStakedTokens(accountName);

    return humps(response);
  }

  async claimEmission(accountName, privateKey) {
    const response = await WalletApi.claimEmission(accountName, privateKey);

    return humps(response);
  }

  async getApproximateRamPriceByBytesAmount(bytesAmount) {
    const response = await WalletApi.getApproximateRamPriceByBytesAmount(bytesAmount);

    return humps(response);
  }

  async buyRam(accountName, bytesAmount, privateKey) {
    const response = await WalletApi.buyRam(accountName, privateKey, bytesAmount);

    return humps(response);
  }

  async sellRam(accountName, bytesAmount, privateKey) {
    const response = await WalletApi.sellRam(accountName, privateKey, bytesAmount);

    return humps(response);
  }

  async getNodes() {
    const response = await this.actions.get('/api/v1/blockchain/nodes/');

    return humps(response.data);
  }

  async voteForNodes(accountName, producers, privateKey, nodeType) {
    const voteFunctions = {
      [BLOCK_PRODUCERS]: WalletApi.voteForBlockProducers,
      [CALCULATOR_NODES]: WalletApi.voteForCalculatorNodes,
    };

    const response = await voteFunctions[nodeType](accountName, privateKey, producers);
    return humps(response);
  }

  async getTransactions(perPage, page) {
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

  async referralTransaction(
    signedTransaction,
    accountNameSource,
    offerId,
    action,
  ) {
    const data = snakes({
      signedTransaction,
      accountNameSource,
      offerId,
      action,
    });

    const response = await this.actions.post('/api/v1/affiliates/referral-transaction', data);

    return humps(response.data);
  }

  async registrationProfile(
    signedTransaction,
    userCreatedAt,
  ) {
    const data = snakes({
      signedTransaction,
      userCreatedAt,
    });

    const response = await this.actions.post('/api/v1/myself/transactions/registration-profile', data);

    return humps(response.data);
  }
}

export { default as graphql } from './graphql';
export default new Api();
