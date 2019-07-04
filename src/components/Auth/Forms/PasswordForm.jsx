import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from '../styles.css';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';

const PASSWORD_ERROR = 'Passwords do not match';

const Password = (props) => {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (password !== passwordRepeat) {
          setFormError(PASSWORD_ERROR);
          return;
        }
        setFormError('');
        if (props.onSubmit) {
          props.onSubmit(password);
        }
      }}
    >
      <h2 className={styles.title}>{props.title}</h2>
      <div className={styles.formContent}>
        <div className={styles.text}>
          Set the Password to save encrypted Active Keys in your browser. This allows you to send the transactions that require Active Keys, using this password.
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
                setFormError(e.target.value !== passwordRepeat ? PASSWORD_ERROR : '');
              }
            }}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Repeat Password"
            value={passwordRepeat}
            onChange={(e) => {
              setPasswordRepeat(e.target.value);
              if (formError) {
                setFormError(e.target.value !== password ? PASSWORD_ERROR : '');
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
          Set Password
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
  title: 'Set a Password to Use your Active Keys Automatically',
};

export default Password;
