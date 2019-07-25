import PropTypes from 'prop-types';
import React, { memo, Fragment } from 'react';
import styles from '../styles.css';
import IconArrowLeft from '../../../Icons/ArrowLeft';
import UserPick from '../../../UserPick';
import KeyFrom from '../../Forms/KeyForm';

const Account = props => (
  <Fragment>
    <div
      role="presentation"
      className={styles.navigation}
      onClick={props.onClickBack}
    >
      <span className={styles.icon}>
        <IconArrowLeft />
      </span>
      <span className={styles.label}>
        <span className={styles.navText}>Change Account</span>
      </span>
    </div>

    <div className={styles.content}>
      <div className={styles.main}>
        <div className={styles.user}>
          <div className={styles.userPick}>
            <UserPick
              shadow
              size={44}
              src={props.userAvatarSrc}
            />
          </div>
          <div className={styles.name}>Hello, {props.userName}!</div>
          <div className={styles.accountName}>@{props.userAccountName}</div>
        </div>
        <KeyFrom
          title="Enter Your Social Key to Authorize"
          placeholder="Private Social Key"
          error={props.error}
          loading={props.loading}
          onChange={props.onChange}
          onSubmit={(socialKey) => {
            props.onSubmit(socialKey);
          }}
        />
      </div>
      <div className={styles.bottom}>
        <span
          className="link red-hover"
          role="presentation"
          onClick={props.onClickNewKeys}
        >
          I have a problem with my key
        </span>
      </div>
    </div>
  </Fragment>
);

Account.propTypes = {
  userAvatarSrc: PropTypes.string,
  userName: PropTypes.string.isRequired,
  userAccountName: PropTypes.string.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onClickNewKeys: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

Account.defaultProps = {
  error: '',
  loading: false,
  userAvatarSrc: undefined,
  onChange: undefined,
};

export default memo(Account);
