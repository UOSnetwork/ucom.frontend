import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import React, { useState, Fragment, memo } from 'react';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import styles from './Post.css';

const Direct = ({
  user, owner, post, ...props
}) => {
  const [formIsVisible, setFormIsVisible] = useState(false);

  if (!post || !user) {
    return null;
  }

  const createdAt = moment(post.createdAt).fromNow();

  return (
    <Fragment>
      {formIsVisible ?
        <Fragment>
          <div className={styles.container}>
            <div className={styles.overlay} role="presentation" onClick={() => setFormIsVisible(false)} />
            <div
              className={classNames({
                [styles.post]: true,
                [styles.postEdit]: formIsVisible,
              })}
              id={`post-${post.id}`}
            >
              <PostFeedHeader
                post={post}
                user={owner}
                userId={owner.id}
                createdAt={createdAt}
                postId={post.id}
                formIsVisible={formIsVisible}
                feedTypeId={props.feedTypeId}
                showForm={() => setFormIsVisible(true)}
              />
              <PostFeedContent
                post={post}
                postId={props.id}
                userId={owner.id}
                postTypeId={post.postTypeId}
                linkText={post.description}
                formIsVisible={formIsVisible}
                hideForm={() => setFormIsVisible(false)}
              />
            </div>
          </div>
          <div className={styles.post} id={`post-${post.id}`}>
            <PostFeedFooter
              post={post}
              formIsVisible={formIsVisible}
              commentsCount={post.commentsCount}
              postTypeId={post.postTypeId}
              sharePopup={props.sharePopup}
              toggleShare={props.toggleShare}
            />
          </div>
        </Fragment>
        :
        <div className={styles.post} id={`post-${post.id}`}>
          <PostFeedHeader
            post={post}
            user={owner}
            userId={owner.id}
            createdAt={createdAt}
            postId={post.id}
            formIsVisible={formIsVisible}
            feedTypeId={props.feedTypeId}
            showForm={() => setFormIsVisible(true)}
          />
          <PostFeedContent
            post={post}
            postId={props.id}
            userId={owner.id}
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
  sharePopup: PropTypes.bool.isRequired,
  toggleShare: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  owner: PropTypes.objectOf(PropTypes.any).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default memo(Direct, (prev, next) => (
  prev.owner.id === next.owner.id &&
  prev.post.description === next.post.description &&
  prev.sharePopup === next.sharePopup &&
  isEqual(prev.post.entityImages, next.post.entityImages)
));
