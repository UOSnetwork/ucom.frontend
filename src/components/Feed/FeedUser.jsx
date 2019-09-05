// TODO: Refactoring all feed components

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { feedReset, feedGetUserPosts, createPost as feedCreatePost } from '../../actions/feed';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import { FEED_PER_PAGE } from '../../utils/feed';
import { POST_TYPE_DIRECT_ID } from '../../utils/posts';
import FeedView from './FeedView';
import { commentsResetContainerDataById } from '../../actions/comments';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../utils/comments';
import withLoader from '../../utils/withLoader';
import equalByProps from '../../utils/equalByProps';
import { getSocialKey } from '../../utils/keys';
import { selectOwner, selectUserById, selectOrgById } from '../../store/selectors';
import { authShowPopup } from '../../actions/auth';

const FeedUser = (props) => {
  const dispatch = useDispatch();
  const feed = useSelector(state => state.feed, isEqual);
  const owner = useSelector(selectOwner, equalByProps(['accountName']));
  const user = useSelector(selectUserById(props.userId), equalByProps(['accountName']));
  const org = useSelector(selectOrgById(props.organizationId), equalByProps(['blockchainId']));

  const onClickLoadMore = useMemo(() => async () => {
    await withLoader(dispatch(feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: feed.metadata.page + 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
    })));
  }, [props.feedTypeId, feed, props.userId, props.organizationId, props.tagIdentity]);

  const onSubmitPostForm = useMemo(() => async (description, entityImages) => {
    const ownerPrivateKey = getSocialKey();

    if (!owner.id || !owner.accountName || !ownerPrivateKey) {
      dispatch(authShowPopup());
      return;
    }

    try {
      await withLoader(dispatch(feedCreatePost(
        owner.id,
        owner.accountName,
        ownerPrivateKey,
        props.userId,
        user && user.accountName,
        props.organizationId,
        org && org.blockchainId,
        {
          description,
          entityImages,
          postTypeId: POST_TYPE_DIRECT_ID,
        },
      )));

      if (props.callbackOnSubmit) {
        props.callbackOnSubmit();
      }
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  }, [props.organizationId, props.userId, props.callbackOnSubmit, owner, user, org]);

  useEffect(() => {
    dispatch(feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
    }));

    return () => {
      dispatch(feedReset());
      dispatch(commentsResetContainerDataById({
        containerId: COMMENTS_CONTAINER_ID_FEED_POST,
      }));
    };
  }, [props.userId, props.organizationId, props.tagIdentity]);

  return (
    <FeedView
      hasMore={feed.metadata.hasMore}
      postIds={feed.postIds}
      loading={feed.loading}
      feedInputInitialText={props.feedInputInitialText}
      onClickLoadMore={onClickLoadMore}
      onSubmitPostForm={onSubmitPostForm}
      filter={props.filter}
      feedTypeId={props.feedTypeId}
      originEnabled={props.originEnabled}
      forUserId={props.userId}
      forOrgId={props.organizationId}
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
