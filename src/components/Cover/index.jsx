import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Cover = ({ src }) => {
  if (!src) {
    return null;
  }

  return (
    <div className={styles.cover}>
      <img src={src} alt="" />
    </div>
  );
};


Cover.propTypes = {
  src: PropTypes.string,
};

Cover.defaultProps = {
  src: undefined,
};

export default Cover;
