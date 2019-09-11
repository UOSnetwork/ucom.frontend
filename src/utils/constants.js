const { Dictionary } = require('ucom-libs-wallet');
const { PostTypes } = require('ucom.libs.common').Posts.Dictionary;
const { EntityNames } = require('ucom.libs.common').Common.Dictionary;
const { InteractionTypeDictionary } = require('ucom-libs-social-transactions');

export const ERROR_SERVER = 'Could not complete request, please try again later';
export const ERROR_WRONG_BRAINKEY = 'Wrong brainkey format';
export const COPY_TO_CLIPBOARD_SUCCESS_MESSAGE = 'Link copied to clipboard';

export const NOTIFICATION_TITLE_ERROR = 'Error';
export const NOTIFICATION_TITLE_SUCCESS = 'Success';
export const NOTIFICATION_TITLE_WARNING = 'Warning';
export const NOTIFICATION_ERROR_FORM_VALIDATION = 'Some fields in the form are incorrect';
export const NOTIFICATION_ERROR_MAINTANCE_MODE = 'The platform is on maintenance and in a read-only mode. Please avoid posting content, it will not be published.';

export const VALIDATION_INPUT_MAX_LENGTH = 255;
export const VALIDATION_TEXTAREA_MAX_LENGTH = 1024;
export const VALIDATION_INPUT_MAX_LENGTH_ERROR = 'Field is too long (maximum is 255 characters)';
export const VALIDATION_TEXTAREA_MAX_LENGTH_ERROR = 'Field is too long (maximum is 1024 characters)';
export const VALIDATION_REQUIRED_ERROR = 'Field can\'t be blank';
export const VALIDATION_URL_ERROR = 'Field is not a valid url';
export const VALIDATION_EMAIL_ERROR = 'Field is not a valid email';
export const VALIDATION_ACCOUNT_NAME_ERROR = 'Field is not a valid account name';

export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const SOURCE_TYPE_EXTERNAL = 'external';
export const SOURCE_TYPE_INTERNAL = 'internal';

export const SOURCES_ID_FACEBOOK = 1;
export const SOURCES_ID_REDDIT = 2;
export const SOURCES_ID_MEDIUM = 3;
export const SOURCES_ID_TWITTER = 4;
export const SOURCES_ID_GITHUB = 5;

export const USERS_TEAM_STATUS_ID_PENDING = 0;
export const USERS_TEAM_STATUS_ID_CONFIRMED = 1;
export const USERS_TEAM_STATUS_ID_DECLINED = 2;

export const LIST_ORDER_BY_ID = '-id';
export const LIST_ORDER_BY_RATE = '-current_rate';
export const LIST_PER_PAGE = 10;

export const BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS = Dictionary.BlockchainNodes.typeBlockProducer();
export const BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES = Dictionary.BlockchainNodes.typeCalculator();

export const NODES_PER_PAGE = 60;
export const BP_STATUS_ACTIVE_ID = 1;
export const BP_STATUS_BACKUP_ID = 2;
export const BP_STATUS_NOT_ACTIVE_ID = 3;
export const PRODUCERS_LIMIT = 30;

export const USER_EDITABLE_PROPS = [
  'id',
  'accountName',
  'lastName',
  'firstName',
  'entityImages',
  'avatarFilename',
  'about',
  'moodMessage',
  'createdAt',
  'updatedAt',
  'personalWebsiteUrl',
  'isTrackingAllowed',
  'usersSources',
];

export const BRAINKEY_SYMBOLS_REGEXP = /^[a-zA-Z_ ]*$/;
export const BRAINKEY_LENGTH = 12;

export const USER_ACCOUNT_LENGTH = 12;
export const USER_ACCOUNT_NAME_REG_EXP = /^[a-z1-5]{12}$/;
export const USER_ACCOUNT_NAME_SYMBOLS_REG_EXP = /^[a-z1-5]+$/;


export const UPVOTE_STATUS = 'upvote';
export const DOWNVOTE_STATUS = 'downvote';
export const NOVOTE_STATUS = 'no_vote';

export const POST_TYPE_MEDIA_ID = PostTypes.MEDIA;
export const POST_TYPE_DIRECT_ID = PostTypes.DIRECT;
export const POST_TYPE_OFFER_ID = PostTypes.OFFER;
export const POST_TYPE_REPOST_ID = PostTypes.REPOST;

export const ENTITY_IMAGES_SYMBOLS_LIMIT = 5000;
export const ENTITY_IMAGES_SYMBOLS_LIMIT_ERROR = 'Maximum number of embeds exceeded';

export const POSTS_DRAFT_LOCALSTORAGE_KEY = 'post_data_v_1';

export const ENTITY_NAMES_USERS = EntityNames.USERS;
export const ENTITY_NAMES_ORG = EntityNames.ORGANIZATIONS;
export const ENTITY_NAMES_POSTS = EntityNames.POSTS;
export const ENTITY_NAMES_COMMENTS = EntityNames.COMMENTS;

// TODO: Remove ucom-libs-social-transactions
export const INTERACTION_TYPE_ID_VOTING_UPVOTE = InteractionTypeDictionary.getUpvoteId();
export const INTERACTION_TYPE_ID_VOTING_DOWNVOTE = InteractionTypeDictionary.getDownvoteId();

export const TRANSACTION_PERMISSION_ACTIVE = 'active';
export const TRANSACTION_PERMISSION_SOCIAL = 'social';

export const WORKER_GET_ACTIVE_KEY_BY_BRAINKEY = 'GET_ACTIVE_KEY_BY_BRAINKEY';
export const WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY = 'GET_SOCIAL_KEY_BY_ACTIVE_KEY';
export const WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY = 'GET_PUBLIC_KEY_BY_PRIVATE_KEY';
export const WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS = 'BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS';
export const WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE = 'WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE';
export const WORKER_ECC_SIGN = 'ECC_SIGN';
export const WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION = 'WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION';
export const WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION = 'WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION';
export const WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION = 'WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION';
export const WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION = 'WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION';
export const WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION = 'WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION';
export const WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION = 'WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION';
export const WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON = 'WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON';
export const WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON = 'WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON';
export const WORKER_SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION = 'WORKER_SIGN_CREATE_PUBLICATION_FROM_ORGANIZATION';
export const WORKER_SIGN_CREATE_PUBLICATION_FROM_USER = 'WORKER_SIGN_CREATE_PUBLICATION_FROM_USER';
export const WORKER_SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION = 'WORKER_SIGN_UPDATE_PUBLICATION_FROM_ORGANIZATION';
export const WORKER_SIGN_UPDATE_PUBLICATION_FROM_USER = 'WORKER_SIGN_UPDATE_PUBLICATION_FROM_USER';
export const WORKER_SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT = 'WORKER_SIGN_CREATE_DIRECT_POST_FOR_ACCOUNT';
export const WORKER_SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION = 'WORKER_SIGN_CREATE_DIRECT_POST_FOR_ORGANIZATION';
export const WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT = 'WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ACCOUNT';
export const WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION = 'WORKER_SIGN_UPDATE_DIRECT_POST_FOR_ORGANIZATION';
