import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { memo } from 'react';
import Direct from './Direct';
import Repost from './Repost';
import Media from './Media';
import { POST_TYPE_REPOST_ID, POST_TYPE_MEDIA_ID } from '../../../utils/posts';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import equalByProps from '../../../utils/equalByProps';
import { selectPostById, selectUserById, selectOwner } from '../../../store/selectors';

const Post = ({
  commentsContainerId, id, feedTypeId, originEnabled,
}) => {
  const post = useSelector(selectPostById(id), equalByProps(['description', 'entityImages']));

  if (!post) {
    return null;
  }

  const user = useSelector(selectUserById(post.userId), () => true);

  if (!user) {
    return null;
  }

  const owner = useSelector(selectOwner, equalByProps(['id']));

  switch (post.postTypeId) {
    case POST_TYPE_REPOST_ID:
      return (
        <Repost
          post={post}
          user={user}
          owner={owner}
          id={id}
          feedTypeId={feedTypeId}
          commentsContainerId={commentsContainerId}
          originEnabled={originEnabled}
        />
      );
    case POST_TYPE_MEDIA_ID:
      return (
        <Media
          post={post}
          user={user}
          owner={owner}
          id={id}
          feedTypeId={feedTypeId}
          commentsContainerId={commentsContainerId}
          originEnabled={originEnabled}
        />
      );
    default:
      return (
        <Direct
          post={post}
          user={user}
          owner={owner}
          id={id}
          feedTypeId={feedTypeId}
          commentsContainerId={commentsContainerId}
          originEnabled={originEnabled}
        />
      );
  }
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
  commentsContainerId: PropTypes.number,
  originEnabled: PropTypes.bool,
  feedTypeId: PropTypes.number.isRequired,
};

Post.defaultProps = {
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
  originEnabled: true,
};

export default memo(Post, equalByProps(['owner.id', 'post.description', 'post.entityImages']));
