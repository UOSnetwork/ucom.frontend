import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import PostFeedFooter from '../Post/PostFeedFooter';

const Autoupdate = ({
  label, commentsCount, postId, content, commentsContainerId,
}) => (
  <div className={styles.autoupdate}>
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.content}>{content}</div>
      <div className={styles.footer}>
        <PostFeedFooter
          postId={postId}
          commentsCount={commentsCount}
          commentsContainerId={commentsContainerId}
        />
      </div>
    </div>
  </div>
);

Autoupdate.propTypes = {
  label: PropTypes.string,
  content: PropTypes.node.isRequired,
  commentsCount: PropTypes.number,
  postId: PropTypes.number.isRequired,
  commentsContainerId: PropTypes.number.isRequired,
};

Autoupdate.defaultProps = {
  label: undefined,
  commentsCount: 0,
};

export * from './wrappers';
export * from './Content';
export default Autoupdate;
