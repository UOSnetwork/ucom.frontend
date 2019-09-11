import PromiseWorker from 'promise-worker';
import {
  WORKER_GET_ACTIVE_KEY_BY_BRAINKEY,
  WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY,
  WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY,
  WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS,
  WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE,
  WORKER_ECC_SIGN,
  WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION,
  WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION,
  WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION,
  WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION,
  WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
  WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
  WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
  WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
  WORKER_SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION,
  WORKER_SIGN_CREATE_PUBLICATION_FROM_USER,
  WORKER_SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION,
  WORKER_SIGN_UPDATE_PUBLICATION_FROM_USER,
  WORKER_SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT,
  WORKER_SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION,
  WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT,
  WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION,
  WORKER_SIGN_CREATE_REPOST_POST_FOR_ACCOUNT,
} from '../utils/constants';

export default class Api {
  static getPromiseWorker() {
    const MainWorker = require('./main.worker');
    const mainWorker = new MainWorker();
    const promiseWorker = new PromiseWorker(mainWorker);

    return promiseWorker;
  }

  static postMessage(action) {
    return Api.getPromiseWorker().postMessage(action);
  }

  static getActiveKeyByBrainKey(...args) {
    return Api.postMessage({
      type: WORKER_GET_ACTIVE_KEY_BY_BRAINKEY,
      args,
    });
  }

  static getSocialKeyByActiveKey(...args) {
    return Api.postMessage({
      type: WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY,
      args,
    });
  }

  static getPublicKeyByPrivateKey(...args) {
    return Api.postMessage({
      type: WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY,
      args,
    });
  }

  static eccSign(...args) {
    return Api.postMessage({
      type: WORKER_ECC_SIGN,
      args,
    });
  }

  static bindSocialKeyWithSocialPermissions(...args) {
    return Api.postMessage({
      type: WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS,
      args,
    });
  }

  static addSocialPermissionsToEmissionAndProfile(...args) {
    return Api.postMessage({
      type: WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE,
      args,
    });
  }

  static getUpvoteContentSignedTransaction(...args) {
    return Api.postMessage({
      type: WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION,
      args,
    });
  }

  static getDownvoteContentSignedTransaction(...args) {
    return Api.postMessage({
      type: WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION,
      args,
    });
  }

  static getFollowAccountSignedTransaction(...args) {
    return Api.postMessage({
      type: WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION,
      args,
    });
  }

  static getUnfollowAccountSignedTransaction(...args) {
    return Api.postMessage({
      type: WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION,
      args,
    });
  }

  static getFollowOrganizationSignedTransaction(...args) {
    return Api.postMessage({
      type: WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
      args,
    });
  }

  static getUnfollowOrganizationSignedTransaction(...args) {
    return Api.postMessage({
      type: WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
      args,
    });
  }

  static getTrustUserSignedTransactionsAsJson(...args) {
    return Api.postMessage({
      type: WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
      args,
    });
  }

  static getUnTrustUserSignedTransactionsAsJson(...args) {
    return Api.postMessage({
      type: WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
      args,
    });
  }

  static signCreatePublicationFromOrganization(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION,
      args,
    });
  }

  static signCreatePublicationFromUser(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_CREATE_PUBLICATION_FROM_USER,
      args,
    });
  }

  static signUpdatePublicationFromOrganization(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION,
      args,
    });
  }

  static signUpdatePublicationFromUser(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_UPDATE_PUBLICATION_FROM_USER,
      args,
    });
  }

  static signCreateDirectPostForAccount(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT,
      args,
    });
  }

  static signCreateDirectPostForOrganization(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION,
      args,
    });
  }

  static signUpdateDirectPostForAccount(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT,
      args,
    });
  }

  static signUpdateDirectPostForOrganization(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION,
      args,
    });
  }

  static signCreateRepostPostForAccount(...args) {
    return Api.postMessage({
      type: WORKER_SIGN_CREATE_REPOST_POST_FOR_ACCOUNT,
      args,
    });
  }
}
