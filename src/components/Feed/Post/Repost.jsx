import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import React from 'react';
import { getUserName } from '../../../utils/user';
import urls from '../../../utils/urls';
import { getPostById } from '../../../store/posts';
import { getUserById } from '../../../store/users';
import { selectUser } from '../../../store/selectors/user';
import { createComment } from '../../../actions/comments';
import { updatePost } from '../../../actions/posts';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import PostCard from '../../PostMedia/PostCard';
import { getPostUrl, getPostTypeById, POST_TYPE_MEDIA_ID, getPostCover } from '../../../utils/posts';
import styles from './Post.css';

const Repost = (props) => {
  const post = getPostById(props.posts, props.id);

  if (!post || !post.post) {
    return null;
  }

  const user = getUserById(props.users, post.userId);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.post}>
      <PostFeedHeader
        userId={user.id}
        postTypeId={props.postTypeId}
        createdAt={moment(post.createdAt).fromNow()}
        postId={post.id}
        userName={getUserName(user)}
        accountName={user.accountName}
        profileLink={urls.getUserUrl(user.id)}
      />

      <div className={styles.repost} id={`post-${post.post.id}`}>
        <PostFeedHeader
          repost
          userId={post.post.user.id}
          postTypeId={post.post.postTypeId}
          createdAt={moment(post.post.createdAt).fromNow()}
          postId={post.post.id}
          userName={getUserName(post.post.user)}
          accountName={post.post.user.accountName}
          profileLink={urls.getUserUrl(post.post.user.id)}
          avatarUrl={urls.getFileUrl(post.post.user.avatarFilename)}
          feedTypeId={props.feedTypeId}
        />

        {post.post.postTypeId === POST_TYPE_MEDIA_ID ? (
          <PostCard
            onFeed
            repost
            coverUrl={getPostCover(post.post)}
            rate={post.post.currentRate}
            title={post.post.title || post.post.leadingText}
            url={getPostUrl(post.post.id)}
            userUrl={urls.getUserUrl(post.post.user && post.post.user.id)}
            userImageUrl={urls.getFileUrl(post.post.user && post.post.user.avatarFilename)}
            userName={getUserName(post.post.user)}
            accountName={post.post.user && post.post.user.accountName}
            tags={post.post.postTypeId && [getPostTypeById(post.post.postTypeId)]}
            commentsCount={post.postTypeId && post.commentsCount}
            sharesCount={post.postTypeId && post.sharesCount}
          />
        ) : (
          <PostFeedContent
            postId={post.post.id}
            userId={post.post.user.id}
          />
        )}
      </div>

      <PostFeedFooter
        commentsCount={post.commentsCount}
        post={post}
        postTypeId={post.postTypeId}
        sharePopup={props.sharePopup}
        toggleShare={props.toggleShare}
      />
    </div>
  );
};

Repost.propTypes = {
  id: PropTypes.number.isRequired,
  posts: PropTypes.objectOf(PropTypes.object).isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  sharePopup: PropTypes.bool.isRequired,
  toggleShare: PropTypes.func.isRequired,
  postTypeId: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
};

export default connect(
  state => ({
    posts: state.posts,
    users: state.users,
    comments: state.comments,
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    createComment,
    updatePost,
  }, dispatch),
)(Repost);
