import React from 'react';
import styles from './styles.css';

const PreloaderImage = () => (
  <div className={styles.imageWrapper}>
    <div className={`${styles.image} ${styles.preloader}`} />
  </div>
);

export default PreloaderImage;
