import React from 'react';
import IconDots from '../../Icons/Dots';
import styles from './styles.css';

const Icon = () => (
  <div className={styles.icon}>
    <button className={styles.button}>
      <IconDots />
    </button>
  </div>
);

export default Icon;
