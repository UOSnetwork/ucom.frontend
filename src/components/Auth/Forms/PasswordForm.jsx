import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from '../styles.css';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';

const PASSWORD_ERROR = 'auth.passwordsNotMatch';

const Password = (props) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (password !== passwordRepeat) {
          setFormError(t(PASSWORD_ERROR));
          return;
        }
        setFormError('');
        if (props.onSubmit) {
          props.onSubmit(password);
        }
      }}
    >
      <h2 className={styles.title}>{props.title || t('Set a Password to Use your Active Keys Automatically')}</h2>
      <div className={styles.formContent}>
        <div className={styles.text}>
          {t('auth.setPasswordToSave')}
        </div>
        <div className={styles.field}>
          <input
            autoFocus
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formError) {
                setFormError(e.target.value !== passwordRepeat ? t(PASSWORD_ERROR) : '');
              }
            }}
          />
          <input
            type="password"
            className={styles.input}
            placeholder={t('Repeat Password')}
            value={passwordRepeat}
            onChange={(e) => {
              setPasswordRepeat(e.target.value);
              if (formError) {
                setFormError(e.target.value !== password ? t(PASSWORD_ERROR) : '');
              }
            }}
          />
          {formError &&
            <div className={styles.error}>
              <IconInputError />
              <span className={styles.text}>{formError}</span>
            </div>
          }
        </div>
      </div>
      <div className={styles.action}>
        <Button
          red
          big
          cap
          strech
          type="submit"
          disabled={Boolean(!password || !passwordRepeat || formError)}
        >
          {t('auth.setPassword')}
        </Button>
      </div>
    </form>
  );
};

Password.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

Password.defaultProps = {
  title: undefined,
};

export default Password;
