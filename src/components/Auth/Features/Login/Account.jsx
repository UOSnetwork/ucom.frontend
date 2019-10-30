import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { memo, Fragment, useState } from 'react';
import styles from '../../styles.css';
import Button from '../../../Button/index';
import IconInputError from '../../../Icons/InputError';
import {
  USER_ACCOUNT_NAME_SYMBOLS_REG_EXP,
  USER_ACCOUNT_NAME_REG_EXP,
} from '../../../../utils/constants';
import urls from '../../../../utils/urls';

const ERROR_WRONG_ACCOUNT_NAME = 'auth.wrongAccount';

const Account = (props) => {
  const { t } = useTranslation();
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
                setFormError(t(ERROR_WRONG_ACCOUNT_NAME));
                return;
              }
              props.onSubmit(accountName.substr(1));
            }}
          >
            <h2 className={styles.title}>{t('auth.whatYourAccount')}</h2>
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
                {t('Proceed')}
              </Button>
            </div>
          </form>
        </div>
        <div className={styles.bottom}>
          <Trans i18nKey="auth.dontHaveAccount">
            Don’t have an account? <Link to={urls.getRegistrationUrl()} className={`red ${styles.navText}`}>Create one</Link>
          </Trans>
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
