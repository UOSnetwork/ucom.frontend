import React from 'react';
import { LayoutBase, LayoutContent } from '../../components/Layout';
import styles from './styles.css';

const GovernancePage = () => (
  <LayoutBase>
    <LayoutContent>
      <div className={styles.header}>
        <div className={styles.info}>
          <h1 className={styles.title}>Governance</h1>
          <div className={styles.rate}>
            Voting Power: <big>2 837°</big>
          </div>
        </div>
        <div className={styles.tabs}>
          <div className={styles.active}>
            Network
          </div>
          <div>
            My Projects
          </div>
          <div>
            Ideas
          </div>
          <div>
            Projects
          </div>
          <div>
            Results
          </div>
        </div>
      </div>
    </LayoutContent>
  </LayoutBase>
);

export default GovernancePage;
