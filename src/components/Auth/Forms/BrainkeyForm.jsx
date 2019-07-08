import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from '../styles.css';
import Button from '../../Button/index';
import IconInputError from '../../Icons/InputError';
import {
  isBrainkeySymbolsValid,
  isBrainkeyLengthValid,
  ERROR_WRONG_BRAINKEY,
} from '../../../utils/brainkey';
import { removeMultipleSpaces } from '../../../utils/text';

const BrainkeyForm = (props) => {
  const [brainkey, setBrainkey] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const trimedBrainkey = brainkey.trim();
        if (!isBrainkeySymbolsValid(trimedBrainkey) || !isBrainkeyLengthValid(trimedBrainkey)) {
          setFormError(ERROR_WRONG_BRAINKEY);
          return;
        }
        setFormError('');
        if (props.onSubmit) {
          props.onSubmit(trimedBrainkey);
        }
      }}
    >
      <h2 className={styles.title}>{props.title}</h2>
      {props.description &&
        <p className={styles.description}>{props.description}</p>
      }
      <div className={styles.field}>
        <input
          autoFocus
          className={styles.input}
          placeholder="Enter your 12-word Brainkey"
          value={brainkey}
          onChange={(e) => {
            const value = removeMultipleSpaces(e.target.value);
            setBrainkey(value);
            if (!isBrainkeySymbolsValid(value)) {
              setFormError(ERROR_WRONG_BRAINKEY);
            } else {
              setFormError('');
            }
            if (props.onChange) {
              props.onChange(value);
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
          disabled={props.loading || Boolean(props.error) || Boolean(formError)}
        >
          Proceed
        </Button>
      </div>
    </form>
  );
};

BrainkeyForm.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

BrainkeyForm.defaultProps = {
  description: undefined,
  error: '',
  loading: false,
  onChange: undefined,
  onSubmit: undefined,
};

export default BrainkeyForm;
