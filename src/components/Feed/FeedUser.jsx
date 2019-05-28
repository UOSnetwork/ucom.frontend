import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { feedReset, feedGetUserPosts, feedCreatePost } from '../../actions/feed';
import { FEED_PER_PAGE } from '../../utils/feed';
import { POST_TYPE_DIRECT_ID } from '../../utils/posts';
import Feed from './FeedView';
import { commentsResetContainerDataById } from '../../actions/comments';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../utils/comments';
import loader from '../../utils/loader';

const FeedUser = (props) => {
  const onClickLoadMore = async () => {
    loader.start();
    await props.feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: props.feed.metadata.page + 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
    });
    loader.done();
  };

  const onSubmitPostForm = (description, entityImages) => {
    props.feedCreatePost(props.feedTypeId, {
      organizationId: props.organizationId,
      userId: props.userId,
      data: {
        description,
        entityImages,
        postTypeId: POST_TYPE_DIRECT_ID,
      },
    });
    if (props.callbackOnSubmit) {
      props.callbackOnSubmit();
    }
  };

  useEffect(() => {
    props.feedReset();
    props.commentsResetContainerDataById({
      containerId: COMMENTS_CONTAINER_ID_FEED_POST,
    });
    props.feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
    });
  }, [props.userId, props.organizationId, props.tagIdentity]);

  return (
    <Feed
      hasMore={props.feed.metadata.hasMore}
      postIds={props.feed.postIds}
      loading={props.feed.loading}
      feedInputInitialText={props.feedInputInitialText}
      onClickLoadMore={onClickLoadMore}
      onSubmitPostForm={onSubmitPostForm}
      filter={props.filter}
      feedTypeId={props.feedTypeId}
    />
  );
};

FeedUser.propTypes = {
  feed: PropTypes.objectOf(PropTypes.any).isRequired,
  feedTypeId: PropTypes.number.isRequired,
  userId: PropTypes.number,
  organizationId: PropTypes.number,
  tagIdentity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  feedReset: PropTypes.func.isRequired,
  commentsResetContainerDataById: PropTypes.func.isRequired,
  feedGetUserPosts: PropTypes.func.isRequired,
  feedCreatePost: PropTypes.func.isRequired,
  feedInputInitialText: PropTypes.string,
  filter: PropTypes.func,
  callbackOnSubmit: PropTypes.func,
};

FeedUser.defaultProps = {
  userId: null,
  organizationId: null,
  tagIdentity: null,
  feedInputInitialText: null,
  filter: null,
  callbackOnSubmit: null,
};

export default connect(
  state => ({
    feed: state.feed,
  }),
  {
    feedReset,
    feedGetUserPosts,
    feedCreatePost,
    commentsResetContainerDataById,
  },
)(FeedUser);
