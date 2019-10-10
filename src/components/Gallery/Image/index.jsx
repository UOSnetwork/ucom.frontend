import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from './styles.css';

const Image = ({
  onClick, label, url, alt, fullView,
}) => (
  <div
    role="presentation"
    className={classNames({
      [styles.image]: true,
      [styles.fullView]: fullView,
    })}
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
  fullView: PropTypes.bool,
};

Image.defaultProps = {
  onClick: undefined,
  label: undefined,
  alt: undefined,
  fullView: true,
};

export default memo(Image);
