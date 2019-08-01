import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from './styles.css';

const Image = ({
  onClick, label, url, alt,
}) => (
  <div
    role="presentation"
    className={styles.image}
    onClick={onClick}
  >
    <img src={url} alt={alt} />
    {label && <span className={styles.label}>{label}</span>}
  </div>
);

Image.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  url: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

Image.defaultProps = {
  onClick: undefined,
  label: undefined,
  alt: undefined,
};

export default memo(Image);
