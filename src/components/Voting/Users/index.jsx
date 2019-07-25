import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Users = () => (
  <div className={styles.users}>
    <h2 className={styles.title}>Votes</h2>

    <div className={styles.tabs}>
      <span className={`${styles.active} ${styles.tab}`}>All (8 234)</span>
      <span className={styles.tab}>117 Up</span>
      <span className={styles.tab}>8 117 Down</span>
    </div>

    <div className={styles.list}>
      <div className={styles.listTitle}>Your Followers</div>
    </div>
  </div>
);

Users.propTypes = {
};

Users.defaultProps = {
};

export default Users;
