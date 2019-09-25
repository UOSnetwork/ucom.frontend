import { EventsIdsDictionary } from 'ucom.libs.common';

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
export const POST_TYPE_AUTOUPDATE_ID = 12;

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

export const EVENT_ID_USER_TRUSTS_YOU = EventsIdsDictionary.getUserTrustsYou();
export const EVENT_ID_USER_UNTRUSTS_YOU = EventsIdsDictionary.getUserUntrustsYou();

export const FEED_EXCLUDE_FILTER_ID_ALL = 1;
export const FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS = 2;
export const FEED_EXCLUDE_FILTER_ID_UPDATES = 3;

export const FEED_TYPE_ID_USER_NEWS = 1;
export const FEED_TYPE_ID_USER_WALL = 2;
export const FEED_TYPE_ID_ORGANIZATION = 3;
export const FEED_TYPE_ID_TAG = 4;
export const FEED_TYPE_ID_MAIN = 5;
export const FEED_PER_PAGE = 10;
