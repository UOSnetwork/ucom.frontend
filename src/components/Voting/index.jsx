import { isEqual } from 'lodash';
import Tippy from '@tippy.js/react';
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

const Votin = ({
  rate, count, selfVote, details, usersPopup, onClick, onClickUp, onClickDown, onShow,
}) => {
  const tippyInstance = useRef();

  const hideTooltip = useCallback(() => {
    if (tippyInstance.current) {
      tippyInstance.current.hide();
    }
  }, [tippyInstance, onClick]);

  return (
    <Fragment>
      <UsersPopup {...usersPopup} />

      <Tippy
        placement="top-center"
        arrow
        interactive
        theme="dropdown-dark"
        trigger="mouseenter"
        content={(
          <Details
            {...details}
            selfVote={selfVote}
            hideTooltip={hideTooltip}
            onClick={() => {
              hideTooltip();

              if (onClick) {
                onClick();
              }
            }}
          />
        )}
        onCreate={(instance) => {
          tippyInstance.current = instance;
        }}
        onShow={onShow}
      >
        <div
          role="presentation"
          className={styles.voting}
          onClick={onClick}
        >
          {onClickUp &&
            <span
              title="Upvote"
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
          </span>
          {onClickDown &&
            <span
              title="Downvote"
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
      </Tippy>
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
  onShow: PropTypes.func,
  onClick: PropTypes.func,
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
  onShow: undefined,
  onClick: undefined,
};

export * from './Wrappers';
export default memo(Votin, isEqual);
