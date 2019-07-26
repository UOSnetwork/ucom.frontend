import { Tooltip } from 'react-tippy';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useRef, useCallback, Fragment } from 'react';
import IconVoteUp from '../Icons/VoteUp';
import IconVoteDown from '../Icons/VoteDown';
import Details from './Details';
import UsersPopup from './UsersPopup';
import { formatRate } from '../../utils/rate';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../../utils/constants';
import styles from './styles.css';

// TODO: Phone version
const Votin = ({
  rate, count, selfVote, details, usersPopup, onClickUp, onClickDown,
}) => {
  const tooltipRef = useRef();

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.hideTooltip();
    }
  }, [tooltipRef]);

  return (
    <Fragment>
      <UsersPopup {...usersPopup} />

      <Tooltip
        arrow
        useContext
        interactive
        unmountHTMLWhenHide
        ref={tooltipRef}
        position="top-center"
        theme="dropdown-dark"
        trigger="mouseenter"
        html={(
          <Details
            {...details}
            selfVote={selfVote}
            onClick={hideTooltip}
          />
        )}
      >
        <div className={styles.voting}>
          <span
            title="Upvote"
            role="presentation"
            className={classNames({
              [styles.voteBtn]: true,
              [styles.up]: selfVote === UPVOTE_STATUS,
            })}
            onClick={onClickUp}
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
            title="Downvote"
            role="presentation"
            className={classNames({
              [styles.voteBtn]: true,
              [styles.down]: selfVote === DOWNVOTE_STATUS,
            })}
            onClick={onClickDown}
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
  popupVisible: PropTypes.bool,
  details: PropTypes.shape(Details.propTypes),
  usersPopup: PropTypes.shape(UsersPopup.propTypes),
  onClickUp: PropTypes.func,
  onClickDown: PropTypes.func,
};

Votin.defaultProps = {
  rate: formatRate(0, true),
  count: 0,
  selfVote: undefined,
  popupVisible: false,
  details: Details.defaultProps,
  usersPopup: UsersPopup.defaultProps,
  onClickUp: undefined,
  onClickDown: undefined,
};

export * from './Wrappers';
export default memo(Votin);
