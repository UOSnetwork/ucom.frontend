import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import UserPick from '../../UserPick';

const AccountCard = ({ userAvatarSrc, userUrl, userAccountName }) => (
  <div className={styles.accountCard}>
    <UserPick shadow size={64} src={userAvatarSrc} url={userUrl} />
    <div>
      <div className={styles.name}>@{userAccountName}</div>
      <div className={styles.label}>Personal Account</div>
    </div>
  </div>
);

AccountCard.propTypes = {
  userAvatarSrc: PropTypes.string,
  userUrl: PropTypes.string,
  userAccountName: PropTypes.string,
};

AccountCard.defaultProps = {
  userAvatarSrc: undefined,
  userAccountName: '…',
  userUrl: undefined,
};

export default AccountCard;
