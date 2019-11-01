import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from '../styles.css';
import Button from '../../Button/index';
import IconInputError from '../../Icons/InputError';
import { privateKeyIsValid } from '../../../utils/keys';

const KEY_ERROR = 'auth.wrongKeyFormat';

const KeyForm = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.form}
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
      <h2 className={styles.title}>{props.title}</h2>
      <div className={styles.field}>
        <input
          autoFocus
          className={`${styles.input} ym-disable-keys`}
          placeholder={props.placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (formError && !privateKeyIsValid(e.target.value)) {
              setFormError(t(KEY_ERROR));
            } else {
              setFormError('');
            }
            if (props.onChange) {
              props.onChange(e.target.value);
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
          disabled={Boolean(props.loading || props.error || formError)}
        >
          {props.submitText || t('Enter')}
        </Button>
      </div>
      {props.hint && <div className={styles.hint}>{props.hint}</div>}
    </form>
  );
};

KeyForm.propTypes = {
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
  submitText: PropTypes.string,
  hint: PropTypes.string,
};

KeyForm.defaultProps = {
  error: '',
  loading: false,
  onChange: undefined,
  submitText: undefined,
  hint: '',
};

export default KeyForm;
