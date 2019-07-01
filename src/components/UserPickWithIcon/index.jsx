import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import UserPick from '../UserPick/UserPick';

const UserPickWithIcon = ({ userPick, icon, iconSize }) => (
  <div className={styles.userPickWithIcon}>
    <UserPick {...userPick} />
    <span
      className={styles.icon}
      style={{
        width: `${iconSize}px`,
        height: `${iconSize}px`,
      }}
    >
      {icon}
    </span>
  </div>
);

UserPickWithIcon.propTypes = {
  userPick: PropTypes.shape(UserPick.propTypes).isRequired,
  icon: PropTypes.node.isRequired,
  iconSize: PropTypes.number,
};

UserPickWithIcon.defaultProps = {
  iconSize: 16,
};

export default UserPickWithIcon;
