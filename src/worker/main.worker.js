import Wallet from 'ucom-libs-wallet';
import ecc from 'eosjs-ecc';
import registerPromiseWorker from 'promise-worker/register';
import { getActivePrivateKey, getSocialPrivateKeyByActiveKey, getPublicKeyByPrivateKey } from '../utils/keys';
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

const { SocialKeyApi, SocialApi } = Wallet;
const { ContentInteractionsApi, PublicationsApi } = Wallet.Content;

registerPromiseWorker((action) => {
  switch (action.type) {
    case WORKER_GET_ACTIVE_KEY_BY_BRAINKEY:
      return getActivePrivateKey(...action.args);

    case WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY:
      return getSocialPrivateKeyByActiveKey(...action.args);

    case WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY:
      return getPublicKeyByPrivateKey(...action.args);

    case WORKER_ECC_SIGN:
      return ecc.sign(...action.args);

    case WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS:
      return SocialKeyApi.bindSocialKeyWithSocialPermissions(...action.args);

    case WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE:
      return SocialKeyApi.addSocialPermissionsToEmissionAndProfile(...action.args);

    case WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION:
      return ContentInteractionsApi.getUpvoteContentSignedTransaction(...action.args);

    case WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION:
      return ContentInteractionsApi.getUpvoteContentSignedTransaction(...action.args);

    case WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION:
      return SocialApi.getFollowAccountSignedTransaction(...action.args);

    case WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION:
      return SocialApi.getUnfollowAccountSignedTransaction(...action.args);

    case WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION:
      return SocialApi.getFollowOrganizationSignedTransaction(...action.args);

    case WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION:
      return SocialApi.getUnfollowOrganizationSignedTransaction(...action.args);

    case WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON:
      return SocialApi.getTrustUserSignedTransactionsAsJson(...action.args);

    case WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON:
      return SocialApi.getUnTrustUserSignedTransactionsAsJson(...action.args);

    case WORKER_SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION:
      return PublicationsApi.signCreatePublicationFromOrganization(...action.args);

    case WORKER_SIGN_CREATE_PUBLICATION_FROM_USER:
      return PublicationsApi.signCreatePublicationFromUser(...action.args);

    case WORKER_SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION:
      return PublicationsApi.signUpdatePublicationFromOrganization(...action.args);

    case WORKER_SIGN_UPDATE_PUBLICATION_FROM_USER:
      return PublicationsApi.signUpdatePublicationFromUser(...action.args);

    case WORKER_SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT:
      return PublicationsApi.signCreateDirectPostForAccount(...action.args);

    case WORKER_SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION:
      return PublicationsApi.signCreateDirectPostForOrganization(...action.args);

    case WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT:
      return PublicationsApi.signUpdateDirectPostForAccount(...action.args);

    case WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION:
      return PublicationsApi.signUpdateDirectPostForOrganization(...action.args);

    default:
      return null;
  }
});
