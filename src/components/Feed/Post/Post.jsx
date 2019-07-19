import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { memo } from 'react';
import Direct from './Direct';
import Repost from './Repost';
import Media from './Media';
import { POST_TYPE_REPOST_ID, POST_TYPE_MEDIA_ID } from '../../../utils/posts';
import { getPostById } from '../../../store/posts';
import { getUserById } from '../../../store/users';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';

const Post = ({
  post, user, owner, commentsContainerId, ...props
}) => {
  if (!post || !user) {
    return null;
  }

  switch (post.postTypeId) {
    case POST_TYPE_REPOST_ID:
      return (
        <Repost
          post={post}
          user={user}
          owner={owner}
          id={props.id}
          feedTypeId={props.feedTypeId}
          commentsContainerId={commentsContainerId}
        />
      );
    case POST_TYPE_MEDIA_ID:
      return (
        <Media
          post={post}
          user={user}
          owner={owner}
          id={props.id}
          feedTypeId={props.feedTypeId}
          commentsContainerId={commentsContainerId}
        />
      );
    default:
      return (
        <Direct
          post={post}
          user={user}
          owner={owner}
          id={props.id}
          feedTypeId={props.feedTypeId}
          commentsContainerId={commentsContainerId}
        />
      );
  }
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
  commentsContainerId: PropTypes.number,
};

Post.defaultProps = {
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
};

export default connect((state, props) => {
  const post = getPostById(state.posts, props.id);

  return {
    post,
    user: post ? getUserById(state.users, post.userId) : undefined,
    owner: state.user.data,
  };
})(memo(Post, (prev, next) => (
  prev.post &&
  next.post &&
  prev.owner.id === next.owner.id &&
  prev.post.description === next.post.description &&
  isEqual(prev.post.entityImages, next.post.entityImages)
)));
