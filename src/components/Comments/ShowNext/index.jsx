import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import { COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';

const ShowNext = ({
  page, perPage, onClick, postId, containerId, count,
}) => (
  <div className={styles.showNext}>
    <div
      role="presentation"
      className={styles.inner}
      onClick={() => onClick({
        containerId,
        postId,
        perPage,
        page: page + 1,
      })}
    >
      {count ? `Show next ${count} comments` : 'Show more comments'}
    </div>
  </div>
);

ShowNext.propTypes = {
  containerId: PropTypes.oneOf([COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST]).isRequired,
  postId: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ShowNext.defaultProps = {
  count: null,
};

export default ShowNext;
