// TODO: Refactoring all feed components

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { feedReset, feedGetUserPosts, feedSetExcludeFilterId } from '../../actions/feed';
import { FEED_PER_PAGE } from '../../utils/feed';
import FeedView from './FeedView';
import { commentsResetContainerDataById } from '../../actions/comments';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../utils/comments';
import {
  withLoader,
  FEED_EXCLUDE_FILTER_ID_ALL,
  FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS,
  FEED_EXCLUDE_FILTER_ID_UPDATES,
  POST_TYPE_MEDIA_ID,
  POST_TYPE_DIRECT_ID,
  POST_TYPE_OFFER_ID,
  POST_TYPE_REPOST_ID,
  POST_TYPE_AUTOUPDATE_ID,
} from '../../utils';

const getExcludePostTypeIdsByFilterId = (filterId) => {
  switch (filterId) {
    case FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS:
      return [POST_TYPE_DIRECT_ID, POST_TYPE_OFFER_ID, POST_TYPE_REPOST_ID, POST_TYPE_AUTOUPDATE_ID];
    case FEED_EXCLUDE_FILTER_ID_UPDATES:
      return [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID, POST_TYPE_OFFER_ID, POST_TYPE_REPOST_ID];
    default:
      return [];
  }
};

const FeedUser = (props) => {
  const dispatch = useDispatch();
  const feed = useSelector(state => state.feed, isEqual);

  const loadInitial = useMemo(() => async (excludeFilterId) => {
    await withLoader(dispatch(feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
      excludePostTypeIds: getExcludePostTypeIdsByFilterId(excludeFilterId),
    })));
  }, [props.feedTypeId, feed, props.userId, props.organizationId, props.tagIdentity]);

  const loadMore = useMemo(() => async () => {
    await withLoader(dispatch(feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: feed.metadata.page + 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
      excludePostTypeIds: getExcludePostTypeIdsByFilterId(feed.excludeFilterId),
    })));
  }, [props.feedTypeId, feed, props.userId, props.organizationId, props.tagIdentity]);

  const changeExcludeFilterId = (filterId) => {
    dispatch(feedSetExcludeFilterId(filterId));
    loadInitial(filterId);
  };

  useEffect(() => {
    loadInitial();

    return () => {
      dispatch(feedReset());
      dispatch(commentsResetContainerDataById({
        containerId: COMMENTS_CONTAINER_ID_FEED_POST,
      }));
    };
  }, [props.userId, props.organizationId, props.tagIdentity]);

  return (
    <FeedView
      showForm
      callbackOnSubmit={props.callbackOnSubmit}
      hasMore={feed.metadata.hasMore}
      postIds={feed.postIds}
      loading={feed.loading}
      feedInputInitialText={props.feedInputInitialText}
      onClickLoadMore={loadMore}
      filter={props.filter}
      feedTypeId={props.feedTypeId}
      originEnabled={props.originEnabled}
      forUserId={props.userId}
      forOrgId={props.organizationId}
      filters={{
        items: [{
          title: 'All',
          active: feed.excludeFilterId === FEED_EXCLUDE_FILTER_ID_ALL,
          onClick: () => changeExcludeFilterId(FEED_EXCLUDE_FILTER_ID_ALL),
        }, {
          title: 'Media-posts',
          active: feed.excludeFilterId === FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS,
          onClick: () => changeExcludeFilterId(FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS),
        }, {
          title: 'Updates',
          active: feed.excludeFilterId === FEED_EXCLUDE_FILTER_ID_UPDATES,
          onClick: () => changeExcludeFilterId(FEED_EXCLUDE_FILTER_ID_UPDATES),
        }],
      }}
    />
  );
};

FeedUser.propTypes = {
  feedTypeId: PropTypes.number.isRequired,
  userId: PropTypes.number,
  organizationId: PropTypes.number,
  tagIdentity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  feedInputInitialText: PropTypes.string,
  filter: PropTypes.func,
  callbackOnSubmit: PropTypes.func,
  originEnabled: PropTypes.bool,
};

FeedUser.defaultProps = {
  userId: null,
  organizationId: null,
  tagIdentity: null,
  feedInputInitialText: null,
  filter: null,
  callbackOnSubmit: null,
  originEnabled: true,
};

export default memo(FeedUser);
