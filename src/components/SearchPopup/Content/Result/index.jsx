import React from 'react';
import { useSelector } from 'react-redux';
import { UsersEntryList } from '../../../EntryList';
import IconArrowRight from '../../../Icons/ArrowRight';
import styles from './styles.css';

const Result = () => {
  const state = useSelector(state => state.searchPopup);

  return (
    <div
      className={styles.result}
    >
      <div className={styles.inner}>
        <div>
          <div className={styles.title}>Members</div>
          {!state.loading && !state.result.users.ids.length &&
            <div className={styles.notFound}>Not found</div>
          }
          <div className={styles.list}>
            <UsersEntryList ids={state.result.users.ids} />
          </div>
          {state.result.users.hasMore &&
            <div className={styles.footer}>
              View All <IconArrowRight />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Result;
