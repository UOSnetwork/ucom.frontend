import PromiseWorker from 'promise-worker';
import * as actions from './actions';

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
    return Api.postMessage({ args, type: actions.GET_ACTIVE_KEY_BY_BRAINKEY });
  }

  static getSocialKeyByActiveKey(...args) {
    return Api.postMessage({ args, type: actions.GET_SOCIAL_KEY_BY_ACTIVE_KEY });
  }

  static getPublicKeyByPrivateKey(...args) {
    return Api.postMessage({ args, type: actions.GET_PUBLIC_KEY_BY_PRIVATE_KEY });
  }

  static eccSign(...args) {
    return Api.postMessage({ args, type: actions.ECC_SIGN });
  }

  static bindSocialKeyWithSocialPermissions(...args) {
    return Api.postMessage({ args, type: actions.BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS });
  }

  static addSocialPermissionsToEmissionAndProfile(...args) {
    return Api.postMessage({ args, type: actions.ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE });
  }

  static getUpvoteContentSignedTransaction(...args) {
    return Api.postMessage({ args, type: actions.GET_UPVOTE_CONTENT_SIGNED_TRANSACTION });
  }

  static getDownvoteContentSignedTransaction(...args) {
    return Api.postMessage({ args, type: actions.GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION });
  }

  static getFollowAccountSignedTransaction(...args) {
    return Api.postMessage({ args, type: actions.GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION });
  }

  static getUnfollowAccountSignedTransaction(...args) {
    return Api.postMessage({ args, type: actions.GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION });
  }

  static getFollowOrganizationSignedTransaction(...args) {
    return Api.postMessage({ args, type: actions.GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION });
  }

  static getUnfollowOrganizationSignedTransaction(...args) {
    return Api.postMessage({ args, type: actions.GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION });
  }

  static getTrustUserSignedTransactionsAsJson(...args) {
    return Api.postMessage({ args, type: actions.GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON });
  }

  static getUnTrustUserSignedTransactionsAsJson(...args) {
    return Api.postMessage({ args, type: actions.GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON });
  }

  static signCreatePublicationFromOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION });
  }

  static signCreatePublicationFromUser(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_PUBLICATION_FROM_USER });
  }

  static signUpdatePublicationFromOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION });
  }

  static signUpdatePublicationFromUser(...args) {
    return Api.postMessage({ args, type: actions.SIGN_UPDATE_PUBLICATION_FROM_USER });
  }

  static signCreateDirectPostForAccount(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT });
  }

  static signCreateDirectPostForOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION });
  }

  static signUpdateDirectPostForAccount(...args) {
    return Api.postMessage({ args, type: actions.SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT });
  }

  static signUpdateDirectPostForOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION });
  }

  static signCreateRepostPostForAccount(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_REPOST_POST_FOR_ACCOUNT });
  }

  static signCreateCommentFromOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_COMMENT_FROM_ORGANIZATION });
  }

  static signCreateCommentFromUser(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_COMMENT_FROM_USER });
  }

  static updateProfile(...args) {
    return Api.postMessage({ args, type: actions.UPDATE_PROFILE });
  }

  static signCreateOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_CREATE_ORGANIZATION });
  }

  static signUpdateOrganization(...args) {
    return Api.postMessage({ args, type: actions.SIGN_UPDATE_ORGANIZATION });
  }

  static stakeOrUnstakeTokens(...args) {
    return Api.postMessage({ args, type: actions.STAKE_OR_UNSTAKE_TOKENS });
  }

  static voteForBlockProducers(...args) {
    return Api.postMessage({ args, type: actions.VOTE_FOR_BLOCK_PRODUCERS });
  }

  static voteForCalculatorNodes(...args) {
    return Api.postMessage({ args, type: actions.VOTE_FOR_CALCULATOR_NODES });
  }

  static sendTokens(...args) {
    return Api.postMessage({ args, type: actions.SEND_TOKENS });
  }

  static buyRam(...args) {
    return Api.postMessage({ args, type: actions.BUY_RAM });
  }

  static sellRam(...args) {
    return Api.postMessage({ args, type: actions.SELL_RAM });
  }

  static claimEmission(...args) {
    return Api.postMessage({ args, type: actions.CLAIM_EMISSION });
  }
}
