import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextInput from '../../../TextInput';
import IconInputError from '../../../Icons/InputError';
import Button from '../../../Button/index';
import styles from '../../../Wallet/Actions/styles.css'; // TODO: Incapsulate styles
import { restoreEncryptedActiveKey } from '../../../../utils/keys';
import { passwordIsValid } from '../../../../utils/password';

const PASSWORD_ERROR = 'Wrong password format';

const Password = (props) => {
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.content}
      onSubmit={(e) => {
        e.preventDefault();
        if (!passwordIsValid(password)) {
          setFormError(PASSWORD_ERROR);
          return;
        }
        try {
          const activeKey = restoreEncryptedActiveKey(password);
          setFormError('');
          props.onSubmit(activeKey);
        } catch (e) {
          setFormError(e.message);
        }
      }}
    >
      <h2 className={styles.title}>Sign Transaction</h2>
      <p className={styles.text}>Enter the password for your Private Active Key, stored in the browser.</p>
      <div className={styles.field}>
        <TextInput
          autoFocus
          type="password"
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (formError && !passwordIsValid(value)) {
              setFormError(PASSWORD_ERROR);
            } else {
              setFormError('');
            }
            if (props.onChange) {
              props.onChange(value);
            }
          }}
        />
      </div>
      {(formError || props.error) &&
        <div className={`${styles.error} ${styles.flat}`}>
          <IconInputError />
          <span>{formError || props.error}</span>
        </div>
      }
      <div className={styles.action}>
        <Button
          cap
          big
          red
          strech
          type="submit"
          disabled={props.loading || formError || props.error}
        >
          Send
        </Button>
      </div>
      <div className={styles.backLink}>
        <span
          role="presentation"
          className="link red-hover"
          onClick={props.onClickActiveKey}
        >
          Sign the transaction with Private Active key
        </span>
      </div>
    </form>
  );
};

Password.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClickActiveKey: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

Password.defaultProps = {
  onChange: undefined,
  error: undefined,
  loading: undefined,
};

export default Password;
