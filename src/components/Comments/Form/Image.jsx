import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import ButtonRemove from '../../ButtonRemove';

const Image = props => (
  <div className={styles.imageWrapper}>
    <span className={styles.imageRemove}>
      <ButtonRemove onClick={() => props.onClickRemove && props.onClickRemove()} />
    </span>
    <img className={styles.image} src={props.src} alt={props.alt} />
  </div>
);

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClickRemove: PropTypes.func,
};

Image.defaultProps = {
  alt: null,
  onClickRemove: null,
};

export default Image;
