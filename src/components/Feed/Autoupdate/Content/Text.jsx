import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Text = ({ title, text }) => (
  <div className={styles.content}>
    <div className={styles.title}>{title}</div>
    <div className={styles.text}>{text}</div>
  </div>
);

Text.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

Text.defaultProps = {
  title: undefined,
  text: undefined,
};

export default Text;
