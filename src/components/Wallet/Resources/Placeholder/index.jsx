import React from 'react';
import styles from './styles.css';
import rootStyles from '../styles.css';
import Panel from '../../Panel';

const Placeholder = () => (
  <div className={rootStyles.section}>
    <Panel>
      <div className={rootStyles.container}>
        <div className={styles.placeholder}>
          <div className={styles.title} />
          <div className={styles.used} />
          <div className={styles.progress} />
        </div>
      </div>
    </Panel>
  </div>
);

export default Placeholder;
