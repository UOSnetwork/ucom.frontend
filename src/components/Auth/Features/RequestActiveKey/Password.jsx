import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextInput from '../../../TextInput';
import IconInputError from '../../../Icons/InputError';
import Button from '../../../Button/index';
import styles from '../../../Wallet/Actions/styles.css'; // TODO: Incapsulate styles
import { restoreEncryptedActiveKey } from '../../../../utils/keys';
import { passwordIsValid } from '../../../../utils/password';

const PASSWORD_ERROR = 'auth.wrongPasswordFormat';

const Password = (props) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.content}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!passwordIsValid(password)) {
          setFormError(t(PASSWORD_ERROR));
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
      <h2 className={styles.title}>{t('auth.signTransaction')}</h2>
      <p className={styles.text}>{t('auth.enterPasswordPrivateActiveKey')}</p>
      <div className={styles.field}>
        <TextInput
          autoFocus
          type="password"
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (formError && !passwordIsValid(value)) {
              setFormError(t(PASSWORD_ERROR));
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
          {t('Send')}
        </Button>
      </div>
      <div className={styles.backLink}>
        <span
          role="presentation"
          className="link red-hover"
          onClick={props.onClickActiveKey}
        >
          {t('auth.signTransactionPrivateActiveKey')}
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
