import { Tooltip } from 'react-tippy';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useRef, Fragment, useState } from 'react';
import IconVoteUp from '../Icons/VoteUp';
import IconVoteDown from '../Icons/VoteDown';
import Details from './Details';
import Popup, { Content } from '../Popup';
import Users from './Users';
import { formatRate } from '../../utils/rate';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../../utils/constants';
import styles from './styles.css';

const Votin = ({ rate, count, selfVote }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const tooltipRef = useRef();

  return (
    <Fragment>
      {popupVisible &&
        <Popup onClickClose={() => setPopupVisible(false)}>
          <Content
            fixWidth={false}
            onClickClose={() => setPopupVisible(false)}
          >
            <Users />
          </Content>
        </Popup>
      }

      <Tooltip
        arrow
        useContext
        interactive
        ref={tooltipRef}
        position="top-center"
        theme="dropdown-dark"
        trigger="mouseenter"
        html={(
          <Details
            selfVote={selfVote}
            onClickMore={() => {
              if (tooltipRef.current) {
                tooltipRef.current.hideTooltip();
              }
              setPopupVisible(true);
            }}
          />
        )}
      >
        <div className={styles.voting}>
          <span
            className={classNames({
              [styles.voteBtn]: true,
              [styles.up]: selfVote === UPVOTE_STATUS,
            })}
          >
            <IconVoteUp />
          </span>
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
          </span>
          <span
            className={classNames({
              [styles.voteBtn]: true,
              [styles.down]: selfVote === DOWNVOTE_STATUS,
            })}
          >
            <IconVoteDown />
          </span>
        </div>
      </Tooltip>
    </Fragment>
  );
};

Votin.propTypes = {
  rate: PropTypes.string,
  count: PropTypes.number,
  selfVote: PropTypes.string,
};

Votin.defaultProps = {
  rate: formatRate(0, true),
  count: 0,
  selfVote: undefined,
};

export default memo(Votin);
