import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useState, Fragment, memo } from 'react';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import styles from './Post.css';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';

const Direct = ({
  user, owner, post, commentsContainerId, ...props
}) => {
  const [formIsVisible, setFormIsVisible] = useState(false);

  if (!post || !user) {
    return null;
  }

  return (
    <Fragment>
      {formIsVisible ? (
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
                postId={post.id}
                menuVisible={!formIsVisible}
                onClickEdit={() => setFormIsVisible(true)}
                originEnabled={props.originEnabled}
              />
              <PostFeedContent
                post={post}
                forUserId={props.forUserId}
                forOrgId={props.forOrgId}
                postId={props.id}
                postTypeId={post.postTypeId}
                formIsVisible={formIsVisible}
                hideForm={() => setFormIsVisible(false)}
              />
            </div>
          </div>
          <div className={styles.post} id={`post-${post.id}`}>
            <PostFeedFooter
              postId={post.id}
              formIsVisible={formIsVisible}
              commentsCount={post.commentsCount}
            />
          </div>
        </Fragment>
      ) : (
        <div className={styles.post} id={`post-${post.id}`}>
          <PostFeedHeader
            postId={post.id}
            menuVisible={!formIsVisible}
            onClickEdit={() => setFormIsVisible(true)}
            originEnabled={props.originEnabled}
          />
          <PostFeedContent
            post={post}
            user={user}
            postId={props.id}
            postTypeId={post.postTypeId}
            formIsVisible={formIsVisible}
            hideForm={() => setFormIsVisible(false)}
          />
          <PostFeedFooter
            postId={post.id}
            commentsCount={post.commentsCount}
            commentsContainerId={commentsContainerId}
          />
        </div>
      )}
    </Fragment>
  );
};

Direct.propTypes = {
  id: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  owner: PropTypes.objectOf(PropTypes.any).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  commentsContainerId: PropTypes.number,
  originEnabled: PropTypes.bool,
  forUserId: PropTypes.number,
  forOrgId: PropTypes.number,
};

Direct.defaultProps = {
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
  originEnabled: true,
  forUserId: undefined,
  forOrgId: undefined,
};

export default memo(Direct, (prev, next) => (
  prev.owner.id === next.owner.id &&
  prev.post.description === next.post.description &&
  isEqual(prev.post.entityImages, next.post.entityImages)
));
