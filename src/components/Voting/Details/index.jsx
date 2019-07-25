import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import IconVoteUp from '../../Icons/VoteUp';
import IconVoteDown from '../../Icons/VoteDown';
import UserPicks from './UserPicks';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../../../utils/constants';
import styles from './styles.css';

const Details = ({
  upCount, downCount, selfVote, onClickMore,
}) => (
  <div className={styles.details}>
    <span
      className={classNames({
        [styles.icon]: true,
        [styles.up]: selfVote === UPVOTE_STATUS,
      })}
    >
      <IconVoteUp />
    </span>

    <span className={styles.value}>{upCount}</span>

    <UserPicks
      userPicks={[{ src: 'https://avatars2.githubusercontent.com/u/1903474?s=40&v=4' }]}
      onClickMore={onClickMore}
    />

    <span
      className={classNames({
        [styles.icon]: true,
        [styles.down]: selfVote === DOWNVOTE_STATUS,
      })}
    >
      <IconVoteDown />
    </span>

    <span className={styles.value}>{downCount}</span>

    <UserPicks
      onClickMore={onClickMore}
    />
  </div>
);

Details.propTypes = {
  upCount: PropTypes.number,
  downCount: PropTypes.number,
  selfVote: PropTypes.string,
  onClickMore: PropTypes.func,
};

Details.defaultProps = {
  upCount: 175,
  downCount: 14,
  selfVote: undefined,
  onClickMore: undefined,
};

export default Details;
