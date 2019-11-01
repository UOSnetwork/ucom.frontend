import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextInput from '../../../TextInput';
import IconInputError from '../../../Icons/InputError';
import Button from '../../../Button/index';
import styles from '../../../Wallet/Actions/styles.css'; // TODO: Incapsulate styles
import { privateKeyIsValid } from '../../../../utils/keys';

const KEY_ERROR = 'auth.wrongKeyFormat';

const ActiveKey = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.content}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!privateKeyIsValid(value)) {
          setFormError(t(KEY_ERROR));
          return;
        }
        setFormError('');
        props.onSubmit(value);
      }}
    >
      <h2 className={styles.title}>{t('auth.signTransaction')}</h2>
      <div className={styles.field}>
        <TextInput
          autoFocus
          ymDisableKeys
          label={t('auth.activePrivateKey')}
          value={value}
          onChange={(value) => {
            setValue(value);
            if (formError && !privateKeyIsValid(value)) {
              setFormError(t(KEY_ERROR));
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
      <div className={`${styles.action} ${styles.multiple}`}>
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
        <div>
          <span
            role="presentation"
            className="link red-hover"
            onClick={props.onClickSetPassword}
          >
            {t('auth.setPassword')}
          </span>
        </div>
      </div>
    </form>
  );
};

ActiveKey.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClickSetPassword: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

ActiveKey.defaultProps = {
  onChange: undefined,
  error: undefined,
  loading: false,
};

export default ActiveKey;
