import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Button from '../Button/index';
import IconCheck from '../Icons/Check';
import styles from './styles.css';

const FollowButton = ({
  asLink, text, followed, onClick, iconEnabled, ...props
}) => {
  const icon = iconEnabled && followed ? (
    <span className={styles.icon}><IconCheck /></span>
  ) : null;

  return (
    asLink ? (
      <button
        className="link red-hover"
        onClick={onClick}
      >
        {text}
        {icon}
      </button>
    ) : (
      <Button
        {...props}
        strech
        medium
        grayBorder
        onClick={onClick}
      >
        <span>{text}</span>
        {icon}
      </Button>
    )
  );
};

FollowButton.propTypes = {
  asLink: PropTypes.bool,
  text: PropTypes.string,
  followed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  iconEnabled: PropTypes.bool,
};

FollowButton.defaultProps = {
  asLink: false,
  text: 'Follow',
  followed: false,
  iconEnabled: true,
};

export * from './wrappers';
export default memo(FollowButton);
