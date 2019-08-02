import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const LayoutClean = ({ children }) => (
  <div className={`${styles.content} ${styles.clean}`}>
    {children}
  </div>
);

LayoutClean.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutClean;
