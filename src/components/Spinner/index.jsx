import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from './styles.css';

const Spinner = ({ size, color }) => (
  <svg
    viewBox="0 0 50 50"
    className={styles.spinner}
    style={{
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    <circle
      className={styles.path}
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth="5"
      stroke={color}
    />
  </svg>
);

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

Spinner.defaultProps = {
  size: 20,
  color: 'rgba(255,255,255,0.5)',
};

export default memo(Spinner);
