import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import IconComment from '../../Icons/Comment';
import Share from '../../Share';

const Autoupdate = ({
  label, title, text, commentsCount, postId,
}) => (
  <div className={styles.autoupdate}>
    <div className={styles.label}>{label}</div>
    <div className={styles.title}>{title}</div>
    <div className={styles.text}>{text}</div>
    <div className={styles.footer}>
      <div className={styles.commentsCount}>
        <IconComment />
        {commentsCount}
      </div>
      <div className={styles.share}>
        <Share
          postId={postId}
        />
      </div>
    </div>
  </div>
);

Autoupdate.propTypes = {
};

Autoupdate.defaultProps = {
};

export default Autoupdate;
