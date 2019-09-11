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
} from '../utils/constants';

export default class Api {
  static getPromiseWorker() {
    const MainWorker = require('./main.worker');
    const mainWorker = new MainWorker();
    const promiseWorker = new PromiseWorker(mainWorker);

    return promiseWorker;
  }

  static async postMessage(action) {
    const result = await Api.getPromiseWorker().postMessage(action);

    return result;
  }

  static async getActiveKeyByBrainKey(brainkey) {
    const activeKey = await Api.postMessage({
      type: WORKER_GET_ACTIVE_KEY_BY_BRAINKEY,
      brainkey,
    });

    return activeKey;
  }

  static async getSocialKeyByActiveKey(activeKey) {
    const socialKey = await Api.postMessage({
      type: WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY,
      activeKey,
    });

    return socialKey;
  }

  static async getPublicKeyByPrivateKey(privateKey) {
    const publicKey = await Api.postMessage({
      type: WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY,
      privateKey,
    });

    return publicKey;
  }

  static async eccSign(str, privateKey) {
    const sign = await Api.postMessage({
      type: WORKER_ECC_SIGN,
      str,
      privateKey,
    });

    return sign;
  }

  static async bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey) {
    const sign = await Api.postMessage({
      type: WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS,
      accountName,
      activeKey,
      socialPublicKey,
    });

    return sign;
  }

  static async addSocialPermissionsToEmissionAndProfile(accountName, activeKey) {
    const sign = await Api.postMessage({
      type: WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE,
      accountName,
      activeKey,
    });

    return sign;
  }

  static async getUpvoteContentSignedTransaction(accountName, privateKey, blockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION,
      accountName,
      privateKey,
      blockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getDownvoteContentSignedTransaction(accountName, privateKey, blockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION,
      accountName,
      privateKey,
      blockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getFollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async getUnfollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async getFollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      orgBlockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getUnfollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      orgBlockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getTrustUserSignedTransactionsAsJson(ownerAccountName, ownerPrivateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async getUnTrustUserSignedTransactionsAsJson(ownerAccountName, ownerPrivateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async signCreatePublicationFromOrganization(accountName, privateKey, blockchainId, content, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION,
      accountName,
      privateKey,
      blockchainId,
      content,
      permission,
    });

    return signTransaction;
  }

  static async signCreatePublicationFromUser(accountName, privateKey, content, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_CREATE_PUBLICATION_FROM_USER,
      accountName,
      privateKey,
      content,
      permission,
    });

    return signTransaction;
  }

  static async signUpdatePublicationFromOrganization(accountName, privateKey, orgBlockchainId, content, postBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION,
      accountName,
      privateKey,
      orgBlockchainId,
      content,
      postBlockchainId,
      permission,
    });

    return signTransaction;
  }

  static async signUpdatePublicationFromUser(accountName, privateKey, content, blockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_UPDATE_PUBLICATION_FROM_USER,
      accountName,
      privateKey,
      content,
      blockchainId,
      permission,
    });

    return signTransaction;
  }

  static async signCreateDirectPostForAccount(ownerAccountName, ownerPrivateKey, userAccountName, postContent, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT,
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      postContent,
      permission,
    });

    return signTransaction;
  }

  static async signCreateDirectPostForOrganization(ownerAccountName, orgBlockchainId, ownerPrivateKey, postContent, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION,
      ownerAccountName,
      orgBlockchainId,
      ownerPrivateKey,
      postContent,
      permission,
    });

    return signTransaction;
  }

  static async signUpdateDirectPostForAccount(ownerAccountName, ownerPrivateKey, userAccountName, postContent, postBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT,
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      postContent,
      postBlockchainId,
      permission,
    });

    return signTransaction;
  }

  static async signUpdateDirectPostForOrganization(ownerAccountName, ownerPrivateKey, orgBlockchainId, postContent, postBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION,
      ownerAccountName,
      ownerPrivateKey,
      orgBlockchainId,
      postContent,
      postBlockchainId,
      permission,
    });

    return signTransaction;
  }
}
