import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import IconError from '../Icons/InputError';
import styles from './styles.css';

const TextInput = ({
  label, value, submited, onChange, maxLength, type, disabled, placeholder, error, prefix,
}) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (submited) {
      setDirty(true);
    }
  }, [submited]);

  return (
    <div className={styles.textInput}>
      <label>
        {label &&
          <div className={styles.label}>{label}</div>
        }
        <div
          className={classNames({
            [styles.data]: true,
            [styles.withPrefix]: Boolean(prefix),
          })}
        >
          {prefix &&
            <span className={styles.prefix}>{prefix}</span>
          }
          <input
            type={type}
            value={value || ''}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            className={classNames({
              [styles.input]: true,
              [styles.error]: error && dirty,
            })}
            onChange={(e) => {
              setDirty(true);
              onChange(e.target.value);
            }}
          />
          {error && dirty &&
            <span className={styles.icon}>
              <IconError />
            </span>
          }
        </div>
        {error && dirty &&
          <div className={styles.errorMessage}>
            {error}
          </div>
        }
      </label>
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  submited: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  error: PropTypes.string,
};

TextInput.defaultProps = {
  label: undefined,
  value: '',
  submited: false,
  maxLength: undefined,
  type: 'text',
  disabled: false,
  placeholder: undefined,
  error: undefined,
};

export default TextInput;
