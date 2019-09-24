import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import IconComment from '../../../Icons/Comment';
import Comments from '../../../Comments/wrapper';
import Share from '../../../Share';
import styles from './styles.css';
import { PostVoting } from '../../../Voting';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../../utils/comments';

const PostFeedFooter = ({
  postId, commentsCount, commentsContainerId,
}) => (
  <Fragment>
    <div className={styles.footer}>
      <div className={styles.infoBlock}>
        <span className={styles.commentСount}>
          <IconComment />
          {commentsCount}
        </span>

        <Share postId={postId} />
      </div>
      <div>
        <PostVoting postId={postId} />
      </div>
    </div>

    <div className={styles.comments}>
      <Comments postId={postId} containerId={commentsContainerId} />
    </div>
  </Fragment>
);

PostFeedFooter.propTypes = {
  postId: PropTypes.number.isRequired,
  commentsCount: PropTypes.number,
  commentsContainerId: PropTypes.number,
};

PostFeedFooter.defaultProps = {
  commentsCount: 0,
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
};

export default memo(PostFeedFooter);
