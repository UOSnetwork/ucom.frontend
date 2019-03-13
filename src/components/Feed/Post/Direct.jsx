import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import React from 'react';
import { getPostById } from '../../../store/posts';
import { selectUser } from '../../../store/selectors/user';
import { createComment } from '../../../actions/comments';
import { getUserById } from '../../../store/users';
import { escapeQuotes } from '../../../utils/text';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import styles from './Post.css';

const Direct = (props) => {
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
        userId={user.id}
        createdAt={moment(post.createdAt).fromNow()}
        postId={post.id}
      />

      <PostFeedContent
        postId={props.id}
        userId={props.user.id}
        postTypeId={post.postTypeId}
        linkText={escapeQuotes(post.description)}
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

Direct.propTypes = {
  id: PropTypes.number.isRequired,
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
)(Direct);
