import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconComment from '../../../Icons/Comment';
import IconShare from '../../../Icons/Share';
import Comments from '../../../Comments/wrapper';
import ShareBlock from '../../../ShareBlock';
import urls from '../../../../utils/urls';
import styles from './styles.css';
import PostRating from '../../../Rating/PostRating';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../../utils/comments';

const PostFeedFooter = ({
  post, sharePopup, toggleShare, commentsCount,
}) => (
  <Fragment>
    <div className={styles.footer}>
      <div className={styles.infoBlock}>
        <span
          role="presentation"
          className={styles.commentСount}
        >
          <span className="inline inline_small">
            <span className="inline__item">
              <IconComment />
            </span>
            <span className="inline__item">{commentsCount}</span>
          </span>
        </span>
        <div
          role="presentation"
          className={classNames(
            `${styles.share}`,
            { [styles.shareActive]: sharePopup },
          )}
          onClick={toggleShare}
        >
          <span className="inline inline_small">
            <span className="inline__item">
              <IconShare />
            </span>
            <span className="inline__item">Share</span>
          </span>
        </div>
        {sharePopup ? (
          <div className="post__share-popup">
            <ShareBlock
              link={urls.getPostUrl(post)}
              linkPost={post.post && urls.getPostUrl(post.post)}
              postId={post.id}
              onClickClose={toggleShare}
              repostAvailable={post.myselfData.repostAvailable}
              postTypeId={post.postTypeId}
              postPostTypeId={post.post && post.post.postTypeId}
            />
          </div>
        ) : null }
      </div>
      <div>
        <PostRating postId={post.id} />
      </div>
    </div>

    <div className={styles.comments}>
      <Comments postId={post.id} containerId={COMMENTS_CONTAINER_ID_FEED_POST} />
    </div>
  </Fragment>
);

PostFeedFooter.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  sharePopup: PropTypes.bool.isRequired,
  toggleShare: PropTypes.func.isRequired,
  commentsCount: PropTypes.number,
};

PostFeedFooter.defaultProps = {
  commentsCount: 0,
};

export default memo(PostFeedFooter, (prev, next) => (
  prev.sharePopup === next.sharePopup
));
