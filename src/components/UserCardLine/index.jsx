import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UserPick from '../UserPick/UserPick';
import styles from './styles.css';
import { formatScaledImportance } from '../../utils/rate';

const UserCardLine = (props) => {
  const LinkTag = props.url ? Link : 'div';

  return (
    <LinkTag to={props.url} className={styles.userCard}>
      <div className={styles.avatar}>
        <UserPick isOwner={props.isOwner} src={props.userPickSrc} alt={props.userPickAlt} />
      </div>
      <div className={styles.nameBlock}>
        <div className={styles.name}>{props.name}</div>
        {props.accountName &&
          <div className={styles.accountName}>
            {props.sign}{props.accountName}
          </div>
        }
      </div>
      {props.rate &&
        <div className={styles.rate}>
          {formatScaledImportance(props.rate)}
        </div>
      }
    </LinkTag>
  );
};

UserCardLine.propTypes = {
  userPickSrc: PropTypes.string,
  userPickAlt: PropTypes.string,
  name: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  accountName: PropTypes.string.isRequired,
  url: PropTypes.string,
  isOwner: PropTypes.bool,
  sign: PropTypes.string,
};

UserCardLine.defaultProps = {
  userPickSrc: null,
  userPickAlt: null,
  url: PropTypes.null,
  isOwner: false,
  sign: '@',
};

export default UserCardLine;
