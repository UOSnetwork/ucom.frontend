import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import React from 'react';
import { getPostById } from '../../../store/posts';
import { selectUser } from '../../../store/selectors/user';
import { createComment } from '../../../actions/comments';
import { getUserName } from '../../../utils/user';
import { getUserById } from '../../../store/users';
import { getPostCover } from '../../../utils/posts';
import PostFeedHeader from './PostFeedHeader';
import PostFeedFooter from './PostFeedFooter';
import PostCard from '../../PostMedia/PostCard';
import urls from '../../../utils/urls';
import styles from './Post.css';

const Media = (props) => {
  const post = getPostById(props.posts, props.id);

  if (!post) {
    return null;
  }

  const user = getUserById(props.users, post.userId);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.post} id={`post-${post.id}`}>
      <PostFeedHeader
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
        commentsCount={post.commentsCount}
        post={post}
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
  posts: PropTypes.objectOf(PropTypes.object).isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  sharePopup: PropTypes.bool.isRequired,
  toggleShare: PropTypes.func.isRequired,
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
  }, dispatch),
)(Media);
