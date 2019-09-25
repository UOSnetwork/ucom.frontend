import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import UserPick from '../../../UserPick';

const Photo = ({ src, url, alt }) => (
  <div className={styles.content}>
    <div className={styles.photo}>
      <UserPick src={src} url={url} alt={alt} size={100} />
    </div>
  </div>
);

Photo.propTypes = {
  src: PropTypes.string,
  url: PropTypes.string,
  alt: PropTypes.string,
};

Photo.defaultProps = {
  src: undefined,
  url: undefined,
  alt: undefined,
};

export default Photo;
