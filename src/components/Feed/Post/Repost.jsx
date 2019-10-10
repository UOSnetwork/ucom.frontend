import PropTypes from 'prop-types';
import React, { memo, Fragment } from 'react';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import { PublicationCardWrapper } from '../PublicationCard';
import { POST_TYPE_AUTOUPDATE_ID, POST_TYPE_MEDIA_ID } from '../../../utils';
import styles from './Post.css';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import { PostAutoupdate } from '../Autoupdate';

const Repost = ({
  post, user, owner, commentsContainerId, ...props
}) => {
  if (!post || !post.post || !user) {
    return null;
  }

  return (
    <div className={styles.post}>
      <PostFeedHeader
        postId={post.id}
        originEnabled={props.originEnabled}
      />

      <div className={styles.repost} id={`post-${post.post.id}`}>
        {post.post.postTypeId === POST_TYPE_AUTOUPDATE_ID ? (
          <PostAutoupdate flat postId={post.post.id} showFooter={false} />
        ) : (
          <Fragment>
            <PostFeedHeader
              postId={post.post.id}
            />

            {post.post.postTypeId === POST_TYPE_MEDIA_ID ? (
              <div className={styles.publication}>
                <PublicationCardWrapper postId={post.post.id} />
              </div>
            ) : (
              <PostFeedContent
                post={post.post}
                postId={post.post.id}
                userId={post.post.user.id}
              />
            )}
          </Fragment>
        )}
      </div>

      <PostFeedFooter
        postId={post.id}
        commentsCount={post.commentsCount}
        commentsContainerId={commentsContainerId}
      />
    </div>
  );
};

Repost.propTypes = {
  id: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  postTypeId: PropTypes.number,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  owner: PropTypes.objectOf(PropTypes.any),
  commentsContainerId: PropTypes.number,
  originEnabled: PropTypes.bool,
};

Repost.defaultProps = {
  postTypeId: undefined,
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
  originEnabled: true,
  owner: undefined,
};

export default memo(Repost);
