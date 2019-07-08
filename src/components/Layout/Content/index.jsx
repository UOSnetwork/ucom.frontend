import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Content = ({ children }) => (
  <div className={styles.content}>
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Content;
