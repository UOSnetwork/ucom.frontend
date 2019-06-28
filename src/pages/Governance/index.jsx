import React from 'react';
import { LayoutBase, LayoutContent } from '../../components/Layout';
import UserPick from '../../components/UserPick/UserPick';
import IconTick from '../../components/Icons/Tick';
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
          <div className={styles.active}>Network</div>
          <div>My Projects</div>
          <div>Ideas</div>
          <div>Projects</div>
          <div>Results</div>
        </div>

        <div className={styles.description}>
          Govern the U°OS protocol through voting. You can vote for Block Producers and Calculator Nodes. Vote with your Importance.
        </div>
      </div>

      <div className={styles.head}>
        <div className={styles.inner}>
          <UserPick
            organization
            size={48}
          />
          <span className={styles.name}>orgnamea</span>
          <span classNames={styles.rate}>2 837°</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <span className={styles.toggler}>
              <IconTick />
            </span>
            Block Producers
          </div>
          <div className={styles.blurb}>Ongoing voting</div>
          <div className={styles.description}>The Block Producers are decentralized entities that keep the chain running by producing blocks. The Block Producers are elected through voting.</div>
          <div className={styles.vote}>You casted <strong>2 votes</strong></div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <span className={styles.toggler}>
              <IconTick />
            </span>
            Calculator Nodes
          </div>
          <div className={styles.blurb}>Ongoing voting</div>
          <div className={styles.description}>A Calculator Node is a node on the U°OS blockchain dedicated to calculating the activity of user accounts: social, transactional, stake.</div>
          <div className={styles.vote}>You didn’t vote</div>
        </div>
      </div>
    </LayoutContent>
  </LayoutBase>
);

export default GovernancePage;
