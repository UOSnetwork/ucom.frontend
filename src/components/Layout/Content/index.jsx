import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const LayoutContent = ({ children }) => (
  <div className={styles.layoutContent}>
    {children}
  </div>
);

LayoutContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContent;
