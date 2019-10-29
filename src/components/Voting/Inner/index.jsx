import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../../../utils/constants';
import IconVoteUp from '../../Icons/VoteUp';
import IconVoteDown from '../../Icons/VoteDown';
import Spinner from '../../Spinner';
import { formatRate } from '../../../utils/rate';
import styles from './styles.css';

const Inner = ({
  loading, onClick, onClickUp, selfVote, count, rate, onClickDown,
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="presentation"
      className={classNames({
        [styles.voting]: true,
        [styles.loading]: loading,
      })}
      onClick={onClick}
    >
      {onClickUp &&
        <span
          title={t('Upvote')}
          role="presentation"
          className={classNames({
            [styles.voteBtn]: true,
            [styles.up]: selfVote === UPVOTE_STATUS,
          })}
          onClick={(e) => {
            e.stopPropagation();
            onClickUp();
          }}
        >
          <IconVoteUp />
        </span>
      }
      <span className={styles.value}>
        <span
          className={classNames({
            [styles.count]: true,
            [styles.up]: count > 0,
            [styles.down]: count < 0,
          })}
        >
          {count}
        </span>
        <span className={styles.rate}>{rate}</span>
        <span className={styles.spinner}>
          <Spinner color="rgba(0,0,0,0.3)" width={6} size={16} />
        </span>
      </span>
      {onClickDown &&
        <span
          title={t('Downvote')}
          role="presentation"
          className={classNames({
            [styles.voteBtn]: true,
            [styles.down]: selfVote === DOWNVOTE_STATUS,
          })}
          onClick={(e) => {
            e.stopPropagation();
            onClickDown();
          }}
        >
          <IconVoteDown />
        </span>
      }
    </div>
  );
};

Inner.propTypes = {
  rate: PropTypes.string,
  count: PropTypes.number,
  selfVote: PropTypes.string,
  onClickUp: PropTypes.func,
  onClickDown: PropTypes.func,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};

Inner.defaultProps = {
  rate: formatRate(0, true),
  count: 0,
  selfVote: undefined,
  onClickUp: undefined,
  onClickDown: undefined,
  onClick: undefined,
  loading: false,
};

export default Inner;
