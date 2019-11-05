import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import TextInput from '../../TextInput';
import { USER_ACCOUNT_NAME_REG_EXP } from '../../../utils/constants';
import api from '../../../api';
import styles from './styles.css';

const AccountName = ({
  onChange, disabled, error, submited, value,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    accountName: `@${value}`,
    error: error || '',
  });

  const testAccountNameLengthAndSymbolsOrExeption = (str) => {
    if (!USER_ACCOUNT_NAME_REG_EXP.test(str)) {
      throw new Error(t('auth.wrongAccount'));
    }

    return true;
  };

  const testAccountNameUniqOrExeption = async (str) => {
    try {
      await api.checkAccountName(str);
      return true;
    } catch (err) {
      throw new Error(t('accountAlreadyTaken', { accountName: str }));
    }
  };

  const testAccountName = async (str) => {
    try {
      testAccountNameLengthAndSymbolsOrExeption(str);
      await testAccountNameUniqOrExeption(str);
      onChange(str);
      setState(state => ({ ...state, error: '' }));
    } catch (err) {
      onChange('');
      setState(state => ({ ...state, error: err.message }));
    }
  };

  const setAccountName = (accountName = '') => {
    accountName = `@${accountName.replace('@', '')}`;

    setState(state => ({ ...state, accountName }));

    testAccountName(accountName.substr(1));
  };

  useEffect(() => {
    if (value) {
      setState(s => ({ ...s, accountName: `@${value}` }));
    }
  }, [value]);

  return (
    <div className={styles.accountName}>
      <div className={styles.field}>
        <TextInput
          submited={submited}
          disabled={disabled}
          maxLength={13}
          error={state.error || error}
          value={state.accountName}
          onChange={setAccountName}
        />
      </div>

      <div className={styles.hint}>
        <p>
          <Trans i18nKey="Must be 12 characters">Must be <strong>12 characters</strong></Trans>
        </p>
        <p>
          <Trans i18nKey="Must be lowercase only">Must be <strong>lowercase</strong> only</Trans>
        </p>
        <p>
          <Trans i18nKey="сanOnlyNumbers'">Can only have <strong>numbers 1–5</strong></Trans>
        </p>
      </div>
    </div>
  );
};

AccountName.propTypes = {
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  submited: PropTypes.bool,
  value: PropTypes.string,
};

AccountName.defaultProps = {
  disabled: false,
  error: undefined,
  submited: false,
  value: '',
};

export default AccountName;
