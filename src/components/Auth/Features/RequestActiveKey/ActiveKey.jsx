import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextInput from '../../../TextInput';
import IconInputError from '../../../Icons/InputError';
import Button from '../../../Button/index';
import styles from '../../../Resources/Actions/styles.css';
import { privateKeyIsValid } from '../../../../utils/keys';

const KEY_ERROR = 'Wrong key format';

const ActiveKey = (props) => {
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.content}
      onSubmit={(e) => {
        e.preventDefault();
        if (!privateKeyIsValid(value)) {
          setFormError(KEY_ERROR);
          return;
        }
        setFormError('');
        props.onSubmit(value);
      }}
    >
      <h2 className={styles.title}>Sign Transaction</h2>
      <div className={styles.field}>
        <TextInput
          autoFocus
          ymDisableKeys
          label="Active Private Key"
          value={value}
          onChange={(value) => {
            setValue(value);
            if (formError && !privateKeyIsValid(value)) {
              setFormError(KEY_ERROR);
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
          Send
        </Button>
        <div>
          <span
            role="presentation"
            className="link red-hover"
            onClick={props.onClickSetPassword}
          >
            Set Password
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
