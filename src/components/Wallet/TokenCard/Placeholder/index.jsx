import React from 'react';
import styles from './styles.css';
import Card from '../Card';
import Panel from '../../Panel';

const Placeholer = () => (
  <Panel>
    <Card color="rgba(0,0,0,0.03)">
      <div className={styles.title} />
    </Card>
  </Panel>
);

export default Placeholer;
