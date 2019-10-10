import PropTypes from 'prop-types';
import React, { memo } from 'react';
import PostFeedHeader from './PostFeedHeader';
import PostFeedFooter from './PostFeedFooter';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import styles from './Post.css';
import { PublicationCardWrapper } from '../PublicationCard';

const Media = ({
  post, user, owner, commentsContainerId, ...props
}) => {
  if (!post || !user) {
    return null;
  }

  return (
    <div className={styles.post} id={`post-${post.id}`}>
      <PostFeedHeader
        postId={post.id}
        originEnabled={props.originEnabled}
      />

      <div className={styles.publication}>
        <PublicationCardWrapper postId={post.id} />
      </div>

      <PostFeedFooter
        postId={post.id}
        commentsCount={post.commentsCount}
        commentsContainerId={commentsContainerId}
      />
    </div>
  );
};

Media.propTypes = {
  id: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  owner: PropTypes.objectOf(PropTypes.any),
  commentsContainerId: PropTypes.number,
  originEnabled: PropTypes.bool,
};

Media.defaultProps = {
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
  originEnabled: true,
  owner: undefined,
};

export default memo(Media);
