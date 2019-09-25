import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { memo } from 'react';
import Direct from './Direct';
import Repost from './Repost';
import Media from './Media';
import { POST_TYPE_AUTOUPDATE_ID, POST_TYPE_REPOST_ID, POST_TYPE_MEDIA_ID } from '../../../utils';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import equalByProps from '../../../utils/equalByProps';
import { selectPostById, selectUserById, selectOwner } from '../../../store/selectors';
import { PostAutoupdate } from '../Autoupdate';

const Post = ({
  commentsContainerId, id, feedTypeId, originEnabled, forUserId, forOrgId, ...props
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
    case POST_TYPE_AUTOUPDATE_ID:
      return (
        <PostAutoupdate
          {...props}
          postId={id}
          commentsContainerId={commentsContainerId}
        />
      );

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
          forUserId={forUserId}
          forOrgId={forOrgId}
        />
      );
  }
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
  commentsContainerId: PropTypes.number,
  originEnabled: PropTypes.bool,
  feedTypeId: PropTypes.number.isRequired,
  forUserId: PropTypes.number,
  forOrgId: PropTypes.number,
};

Post.defaultProps = {
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
  originEnabled: true,
  forUserId: undefined,
  forOrgId: undefined,
};

export default memo(Post, equalByProps(['owner.id', 'post.description', 'post.entityImages']));
