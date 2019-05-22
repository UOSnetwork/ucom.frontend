import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import React, { useState, Fragment } from 'react';
import { getPostById } from '../../../store/posts';
import { selectUser } from '../../../store/selectors/user';
import { createComment } from '../../../actions/comments';
import { getUserById } from '../../../store/users';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import styles from './Post.css';

const Direct = (props) => {
  const post = getPostById(props.posts, props.id);
  const [formIsVisible, setFormIsVisible] = useState(false);

  if (!post) {
    return null;
  }

  const user = getUserById(props.users, post.userId);
  if (!user) {
    return null;
  }

  return (
    <Fragment>
      {formIsVisible ?
        <Fragment>
          <div className={styles.container}>
            <div className={styles.overlay} role="presentation" onClick={() => setFormIsVisible(false)} />
            <div className={styles.post} id={`post-${post.id}`}>
              <PostFeedHeader
                userId={props.user.id}
                createdAt={moment(post.createdAt).fromNow()}
                postId={post.id}
                formIsVisible={formIsVisible}
                feedTypeId={props.feedTypeId}
                showForm={() => setFormIsVisible(true)}
              />
              <PostFeedContent
                postId={props.id}
                userId={props.user.id}
                postTypeId={post.postTypeId}
                linkText={post.description}
                formIsVisible={formIsVisible}
                hideForm={() => setFormIsVisible(false)}
              />
            </div>
          </div>
          <div className={styles.post} id={`post-${post.id}`}>
            <PostFeedFooter
              formIsVisible={formIsVisible}
              commentsCount={post.commentsCount}
              post={post}
              postTypeId={post.postTypeId}
              sharePopup={props.sharePopup}
              toggleShare={props.toggleShare}
            />
          </div>
        </Fragment>
        :
        <div className={styles.post} id={`post-${post.id}`}>
          <PostFeedHeader
            userId={props.user.id}
            createdAt={moment(post.createdAt).fromNow()}
            postId={post.id}
            formIsVisible={formIsVisible}
            feedTypeId={props.feedTypeId}
            showForm={() => setFormIsVisible(true)}
          />
          <PostFeedContent
            postId={props.id}
            userId={props.user.id}
            postTypeId={post.postTypeId}
            linkText={post.description}
            formIsVisible={formIsVisible}
            hideForm={() => setFormIsVisible(false)}
          />
          <PostFeedFooter
            commentsCount={post.commentsCount}
            post={post}
            postTypeId={post.postTypeId}
            sharePopup={props.sharePopup}
            toggleShare={props.toggleShare}
          />
        </div>
      }
    </Fragment>

  );
};

Direct.propTypes = {
  id: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  posts: PropTypes.objectOf(PropTypes.object).isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
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
