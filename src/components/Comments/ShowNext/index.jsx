import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import { COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';

const ShowNext = ({
  page, perPage, onClick, postId, containerId,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.showNext}>
      <div
        role="presentation"
        className={styles.inner}
        onClick={() => onClick(containerId, postId, perPage, page + 1)}
      >
        {t('Show more comments')}
      </div>
    </div>
  );
};

ShowNext.propTypes = {
  containerId: PropTypes.oneOf([COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST]).isRequired,
  postId: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ShowNext;
