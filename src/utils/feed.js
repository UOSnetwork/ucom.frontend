import {
  FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS,
  FEED_EXCLUDE_FILTER_ID_UPDATES,
  POST_TYPE_MEDIA_ID,
  POST_TYPE_DIRECT_ID,
  POST_TYPE_OFFER_ID,
  POST_TYPE_REPOST_ID,
  POST_TYPE_AUTOUPDATE_ID,
  FEED_TYPE_ID_USER_NEWS,
  FEED_TYPE_ID_USER_WALL,
} from './index';

export const getFeedExcludePostTypeIdsByExcludeFilterId = (filterId) => {
  switch (filterId) {
    case FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS:
      return [POST_TYPE_DIRECT_ID, POST_TYPE_OFFER_ID, POST_TYPE_REPOST_ID, POST_TYPE_AUTOUPDATE_ID];
    case FEED_EXCLUDE_FILTER_ID_UPDATES:
      return [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID, POST_TYPE_OFFER_ID, POST_TYPE_REPOST_ID];
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
