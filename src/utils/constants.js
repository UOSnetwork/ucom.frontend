const { Dictionary } = require('ucom-libs-wallet');

export const ERROR_SERVER = 'Could not complete request, please try again later';
export const ERROR_WRONG_BRAINKEY = 'Wrong brainkey format';

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
