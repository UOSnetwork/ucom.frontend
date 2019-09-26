import { without } from 'lodash';
import {
  FEED_EXCLUDE_FILTER_ID_PUBLICATIONS,
  FEED_EXCLUDE_FILTER_ID_UPDATES,
  FEED_EXCLUDE_FILTER_ID_POSTS,
  POST_TYPE_MEDIA_ID,
  POST_TYPE_DIRECT_ID,
  POST_TYPE_OFFER_ID,
  POST_TYPE_REPOST_ID,
  POST_TYPE_AUTOUPDATE_ID,
  FEED_TYPE_ID_USER_NEWS,
  FEED_TYPE_ID_USER_WALL,
} from './index';

const postTypes = [
  POST_TYPE_MEDIA_ID,
  POST_TYPE_DIRECT_ID,
  POST_TYPE_OFFER_ID,
  POST_TYPE_REPOST_ID,
  POST_TYPE_AUTOUPDATE_ID,
];

export const getFeedExcludePostTypeIdsByExcludeFilterId = (filterId) => {
  switch (filterId) {
    case FEED_EXCLUDE_FILTER_ID_PUBLICATIONS:
      return without(postTypes, POST_TYPE_MEDIA_ID);

    case FEED_EXCLUDE_FILTER_ID_POSTS:
      return without(postTypes, POST_TYPE_DIRECT_ID);

    case FEED_EXCLUDE_FILTER_ID_UPDATES:
      return without(postTypes, POST_TYPE_AUTOUPDATE_ID);

    default:
      return [];
  }
};

export const isFeedExcludeFilterIsEnabledByFeedTypeId = (feedTypeId) => {
  switch (feedTypeId) {
    case FEED_TYPE_ID_USER_NEWS:
    case FEED_TYPE_ID_USER_WALL:
      return true;
    default:
      return false;
  }
};
