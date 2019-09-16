import React from 'react';
import IconShare from '../../Icons/Share';
import styles from './styles.css';

const Button = () => (
  <div className={styles.share}>
    <IconShare />
    <span>Share</span>
  </div>
);

export default Button;
