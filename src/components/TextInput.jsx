import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import IconSearch from '../components/Icons/Search';
import InputErrorIcon from '../components/Icons/InputError';
import InputCompleteIcon from '../components/Icons/InputComplete';
import { decodeText } from '../utils/text';

const TextInput = ({
  value, error, label, topLabel, placeholder, subtext, isSearch, inputWidth, isRequired, type, onChange, disabled, maxLength, isValid, className, ymDisableKeys, touched = false, ...rest
}) => {
  const isIconExist = isSearch || error || isValid;
  let icon;

  if (isSearch) {
    icon = <div className="text-input__icon"><IconSearch /></div>;
  } else if (error) {
    icon = <div className="text-input__icon"><InputErrorIcon /></div>;
  } else if (isValid) {
    icon = <div className="text-input__icon"><InputCompleteIcon /></div>;
  }

  return (
    <div className={cn('text-input', className)}>
      <label>
        {
          (isRequired || label) && (
            <div
              className={cn(
                'text-input__labels-container',
                { 'text-input__labels-container_top': topLabel },
              )}
            >
              { label && <div className="text-input__label">{label}</div> }
              { isRequired && <div className="text-input__required-label">It needs to be filled <span role="img" aria-label="hugging face">🤗</span></div> }
            </div>
          )
        }
        <div className="text-input__input-wrapper" style={{ width: inputWidth }}>
          <input
            maxLength={maxLength}
            value={value === null || value === undefined ? '' : decodeText(value)}
            className={cn('text-input__input', {
              'text-input__input_error': Boolean(error),
              'text-input__input_with-icon': Boolean(isIconExist),
              'ym-disable-keys': ymDisableKeys,
            })}
            type={type || 'text'}
            disabled={disabled}
            placeholder={placeholder}
            touched={touched.toString()}
            onChange={(e) => {
              if (typeof onChange === 'function') {
                onChange(e.target.value);
              }
            }}
            {...rest}
          />

          {icon}
        </div>
      </label>
      { subtext && <div className="text-input__subtext">{subtext}</div> }
      { error && <div className="text-input__error">{error}</div> }
    </div>
  );
};

TextInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  subtext: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.string)]),
  isSearch: PropTypes.bool,
  isRequired: PropTypes.bool,
  inputWidth: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  maxLength: PropTypes.string,
  isValid: PropTypes.bool,
};

export default TextInput;
