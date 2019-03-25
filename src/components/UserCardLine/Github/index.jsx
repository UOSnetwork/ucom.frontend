import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UserPick from '../../UserPick/UserPick';
import styles from './styles.css';
import { formatRate } from '../../../utils/rate';

const UserCardLineTitle = () => (
  <div className={styles.userCardTitle}>
    <div className={styles.block}>
      <div className={classNames(
        `${styles.order}`,
        `${styles.columnTitle}`,
    )}>
      #
      </div>
      <div className={styles.title}>
        <div className={styles.columnTitle}>Name</div>
      </div>
    </div>
    <div className={styles.blockGh}>
      <div className={styles.columnTitle}>Github Name</div>
    </div>
    <div className={styles.blockScore}>
      <div className={styles.columnTitle}>Github SCore</div>
    </div>
  </div>
);

const UserCardLine = (props) => {
  const LinkTag = props.url ? Link : 'div';

  return (
    <LinkTag to={props.url} className={styles.userCard}>
      <div className={styles.block}>
        <div className={styles.order}>{props.order}</div>
        <div className={styles.avatar}>
          <UserPick isOwner={props.isOwner} src={props.userPickSrc} alt={props.userPickAlt} />
        </div>
        <div className={styles.title}>
          <div className={styles.name}>{props.name}</div>
          <div className={styles.accountName}>
            {props.sign}{props.accountName}
          </div>
        </div>
      </div>
      <div className={styles.blockGh}>
        <div className={styles.nameGh}>{props.name}</div>
      </div>
      <div className={styles.blockScore}>
        <div className={styles.nameGh}>{formatRate(props.rate)}</div>
      </div>
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

export { UserCardLine, UserCardLineTitle };
