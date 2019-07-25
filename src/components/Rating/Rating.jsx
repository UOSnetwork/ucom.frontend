import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { UPVOTE_STATUS, DOWNVOTE_STATUS, NOVOTE_STATUS } from '../../utils/constants';
import styles from './styles.css';

const Rating = props => (
  <div className={styles.rating}>
    {!props.disabled && (
      <button
        onClick={() => props.onClickVoteUp()}
        className={classNames(
          styles.icon,
          { [styles.iconGreen]: props.myselfVote === UPVOTE_STATUS },
        )}
      >
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M9.42133 0.603363L15.4624 6.90276C16.6399 8.13063 15.756 10.1501 14.0411 10.1501H12.3992V12.0746C12.3992 13.138 11.5239 14 10.4441 14H5.55657C4.47684 14 3.60154 13.138 3.60154 12.0746V10.1501H1.95891C0.243962 10.1501 -0.639941 8.13063 0.537579 6.90276L6.57867 0.603363C7.35017 -0.201121 8.64983 -0.20112 9.42133 0.603363ZM8 1.92536L1.95891 8.22476H5.55657V12.0746L10.4441 12.0746V8.22476L14.0411 8.22476L8 1.92536Z" />
        </svg>
      </button>
    )}

    <div
      className={classNames(
        styles.value,
        { [styles.valueUp]: props.currentVote > 0 },
        { [styles.valueDown]: props.currentVote < 0 },
      )}
    >
      {props.currentVote > 0 && '+'}{props.currentVote}
    </div>

    {!props.disabled &&
      <button
        onClick={() => props.onClickVoteDown()}
        className={classNames(
          styles.icon,
          { [styles.iconRed]: props.myselfVote === DOWNVOTE_STATUS },
        )}
      >
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M6.57867 13.3957L0.537578 7.09626C-0.639941 5.86839 0.243965 3.8489 1.95891 3.8489L3.60084 3.8489L3.60084 1.92438C3.60084 0.861036 4.47614 -0.00097757 5.55587 -0.000977476L10.4434 -0.000977048C11.5232 -0.000976954 12.3985 0.861038 12.3985 1.92438L12.3985 3.8489L14.0411 3.8489C15.756 3.8489 16.6399 5.8684 15.4624 7.09626L9.42133 13.3957C8.64983 14.2001 7.35017 14.2001 6.57867 13.3957ZM8 12.0737L14.0411 5.77427L10.4434 5.77427L10.4434 1.92438L5.55587 1.92438L5.55587 5.77427L1.95891 5.77426L8 12.0737Z" />
        </svg>
      </button>
    }
  </div>
);

Rating.propTypes = {
  disabled: PropTypes.bool,
  myselfVote: PropTypes.oneOf([UPVOTE_STATUS, DOWNVOTE_STATUS, NOVOTE_STATUS]),
  currentVote: PropTypes.number,
  onClickVoteDown: PropTypes.func.isRequired,
  onClickVoteUp: PropTypes.func.isRequired,
};

Rating.defaultProps = {
  disabled: false,
  myselfVote: NOVOTE_STATUS,
  currentVote: 0,
};

export default Rating;
