import React from 'react';
import { LayoutBase, LayoutContent } from '../../components/Layout';
import UserPick from '../../components/UserPick/UserPick';
import IconTick from '../../components/Icons/Tick';
import Footer from '../../components/Footer';
import Button from '../../components/Button/index';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
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
          <span>2 837°</span>
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

          <div className={styles.action}>
            <Button red small>Go to Voting</Button>
          </div>

          <div className={styles.table}>
            <Table
              template={['24px', 'auto', '60px', '120px', '70px']}
              cols={[{
                hideOnSmall: true,
              }, {
                title: 'Organization',
              }, {
                title: 'Votes',
                right: true,
              }, {
                title: 'Vote amount',
                hideOnSmall: true,
                right: true,
              }, {
                title: 'State',
              }]}
              data={[
                [<UserPick size={24} />, <nobr><strong>initcalc1123</strong></nobr>, <nobr className={styles.votes}>2<br /><small>4.878%</small></nobr>, <nobr>482 477</nobr>, <Badge strech green>Active</Badge>],
                [<UserPick size={24} />, <nobr><strong>initcalc1124</strong></nobr>, <nobr className={styles.votes}>3<br /><small>4.878%</small></nobr>, <nobr>482 477</nobr>, <Badge strech>Backup</Badge>],
              ]}
            />
          </div>
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

      <Footer />
    </LayoutContent>
  </LayoutBase>
);

export default GovernancePage;
