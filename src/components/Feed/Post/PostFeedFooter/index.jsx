import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import IconComment from '../../../Icons/Comment';
import Comments from '../../../Comments/wrapper';
import Share from '../../../Share';
import urls from '../../../../utils/urls';
import styles from './styles.css';
import { PostVotingWrapper } from '../../../Voting';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../../utils/comments';

const PostFeedFooter = ({
  post, commentsCount, commentsContainerId,
}) => (
  <Fragment>
    <div className={styles.footer}>
      <div className={styles.infoBlock}>
        <span className={styles.commentСount}>
          <span className="inline inline_small">
            <span className="inline__item">
              <IconComment />
            </span>
            <span className="inline__item">{commentsCount}</span>
          </span>
        </span>

        <Share
          postId={post.id}
          link={urls.getPostUrl(post)}
        />
      </div>
      <div>
        <PostVotingWrapper postId={post.id} />
      </div>
    </div>

    <div className={styles.comments}>
      <Comments postId={post.id} containerId={commentsContainerId} />
    </div>
  </Fragment>
);

PostFeedFooter.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  commentsCount: PropTypes.number,
  commentsContainerId: PropTypes.number,
};

PostFeedFooter.defaultProps = {
  commentsCount: 0,
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
};

export default memo(PostFeedFooter);
