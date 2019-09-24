import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import IconComment from '../../Icons/Comment';
import Share from '../../Share';
import { PostVoting } from '../../Voting';

const Autoupdate = ({
  label, commentsCount, postId, content,
}) => (
  <div className={styles.autoupdate}>
    <div className={styles.label}>{label}</div>
    <div className={styles.content}>{content}</div>
    <div className={styles.footer}>
      <div className={styles.commentsCount}>
        <IconComment />
        {commentsCount}
      </div>
      <div className={styles.share}>
        <Share postId={postId} />
      </div>
      <div className={styles.voting}>
        <PostVoting postId={postId} />
      </div>
    </div>
  </div>
);

Autoupdate.propTypes = {
  label: PropTypes.string,
  content: PropTypes.node.isRequired,
  commentsCount: PropTypes.number,
  postId: PropTypes.number.isRequired,
};

Autoupdate.defaultProps = {
  label: undefined,
  commentsCount: 0,
};

export default Autoupdate;
