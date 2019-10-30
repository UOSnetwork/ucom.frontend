import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import { COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';

const ShowReplies = (props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.showReplies} depth={props.depth}>
      <div className={styles.icon}>
        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 0V7.21812H12M12 7.21812L8.5 4M12 7.21812L8.5 10.2062" stroke="#C4C4C4" />
        </svg>
      </div>
      <div
        role="presentation"
        className={styles.title}
        onClick={() => props.onClick(props.containerId, props.postId, props.parentId, props.parentDepth, props.page)}
      >
        {t('Show replies')}
      </div>
    </div>
  );
};

ShowReplies.propTypes = {
  containerId: PropTypes.oneOf([COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST]).isRequired,
  depth: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  parentId: PropTypes.number.isRequired,
  parentDepth: PropTypes.number.isRequired,
  page: PropTypes.number,
};

ShowReplies.defaultProps = {
  depth: 0,
  page: 1,
};

export default ShowReplies;
