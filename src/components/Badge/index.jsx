import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import styles from './styles.css';

const Badge = ({
  children, green, strech, gray,
}) => (
  <span
    className={classNames({
      [styles.badge]: true,
      [styles.green]: green,
      [styles.strech]: strech,
      [styles.gray]: gray,
    })}
  >
    {children}
  </span>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  green: PropTypes.bool,
  strech: PropTypes.bool,
  gray: PropTypes.bool,
};

Badge.defaultProps = {
  green: false,
  strech: false,
  gray: false,
};

export default Badge;
