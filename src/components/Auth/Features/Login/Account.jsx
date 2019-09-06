import PropTypes from 'prop-types';
import React, { memo, Fragment, useState } from 'react';
import styles from '../../styles.css';
import Button from '../../../Button/index';
import IconInputError from '../../../Icons/InputError';
import {
  USER_ACCOUNT_NAME_SYMBOLS_REG_EXP,
  USER_ACCOUNT_NAME_REG_EXP,
} from '../../../../utils/constants';

const ERROR_WRONG_ACCOUNT_NAME = 'Wrong Account Name format';

const Account = (props) => {
  const [accountName, setAccountName] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <Fragment>
      <div className={styles.content}>
        <div className={styles.main}>
          <form
            className={styles.form}
            onSubmit={async (e) => {
              e.preventDefault();
              if (!USER_ACCOUNT_NAME_REG_EXP.test(accountName.substr(1))) {
                setFormError(ERROR_WRONG_ACCOUNT_NAME);
                return;
              }
              props.onSubmit(accountName.substr(1));
            }}
          >
            <h2 className={styles.title}>What’s Your U°OS Account Name?</h2>
            <div className={styles.field}>
              <input
                type="text"
                maxLength="13"
                className={styles.input}
                placeholder="@account_name"
                value={accountName}
                onBlur={(e) => {
                  if (e.target.value === '@') {
                    setAccountName('');
                  }
                }}
                onFocus={(e) => {
                  if (!e.target.value) {
                    setAccountName('@');
                  }
                }}
                onChange={(e) => {
                  const value = `@${e.target.value.replace('@', '')}`;
                  setAccountName(value);
                  if (!USER_ACCOUNT_NAME_SYMBOLS_REG_EXP.test(value.substr(1))) {
                    setFormError(ERROR_WRONG_ACCOUNT_NAME);
                  } else {
                    setFormError('');
                  }
                  if (props.onChange) {
                    props.onChange(accountName.substr(1));
                  }
                }}
              />
              {(formError || props.error) &&
                <div className={styles.error}>
                  <IconInputError />
                  <span className={styles.text}>{formError || props.error}</span>
                </div>
              }
            </div>
            <div className={styles.action}>
              <Button
                red
                big
                cap
                strech
                type="submit"
                disabled={Boolean(props.loading || formError || props.error)}
              >
                Proceed
              </Button>
            </div>
          </form>
        </div>
        <div className={styles.bottom}>
          Don’t have an account?&nbsp;
          <a href="#" className={`red ${styles.navText}`}>Create one</a>
        </div>
      </div>
    </Fragment>
  );
};

Account.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

Account.defaultProps = {
  error: '',
  loading: false,
  onChange: undefined,
};

export default memo(Account);
