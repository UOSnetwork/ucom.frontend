import PropTypes from 'prop-types';
import moment from 'moment';
import React, { memo } from 'react';
import { getUserName } from '../../../utils/user';
import { getPostCover } from '../../../utils/posts';
import PostFeedHeader from './PostFeedHeader';
import PostFeedFooter from './PostFeedFooter';
import PostCard from '../../PostMedia/PostCard';
import urls from '../../../utils/urls';
import styles from './Post.css';

const Media = ({
  post, user, owner, ...props
}) => {
  if (!post || !user) {
    return null;
  }

  return (
    <div className={styles.post} id={`post-${post.id}`}>
      <PostFeedHeader
        post={post}
        user={owner}
        postId={post.id}
        feedTypeId={props.feedTypeId}
        createdAt={moment(post.createdAt).fromNow()}
      />

      <PostCard
        onFeed
        coverUrl={getPostCover(post)}
        rate={post.currentRate}
        title={post.title || post.leadingText}
        url={urls.getPostUrl(post)}
        userImageUrl={urls.getFileUrl(user.avatarFilename)}
        userName={getUserName(post.user)}
        accountName={post.user && post.user.accountName}
        commentsCount={post.postTypeId && post.commentsCount}
        sharesCount={post.postTypeId && post.sharesCount}
        userUrl={urls.getUserUrl(user.id)}
      />

      <PostFeedFooter
        post={post}
        commentsCount={post.commentsCount}
        postTypeId={post.postTypeId}
        sharePopup={props.sharePopup}
        toggleShare={props.toggleShare}
      />
    </div>
  );
};

Media.propTypes = {
  id: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  sharePopup: PropTypes.bool.isRequired,
  toggleShare: PropTypes.func.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default memo(Media, (prev, next) => (
  prev.sharePopup === next.sharePopup
));
