import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import UserPick from '../UserPick';

const UserPickWithIcon = ({
  userPick, icon, iconSize, iconX, iconY,
}) => (
  <div className={styles.userPickWithIcon}>
    <UserPick {...userPick} />
    <span
      className={styles.icon}
      style={{
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        transform: `translate(${iconX}, ${iconY})`,
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
  iconX: PropTypes.string,
  iconY: PropTypes.string,
};

UserPickWithIcon.defaultProps = {
  iconSize: 16,
  iconX: '25%',
  iconY: '25%',
};

export default UserPickWithIcon;
