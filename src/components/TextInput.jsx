import React from 'react';
import classNames from 'classnames';
import IconSearch from '../components/Icons/Search';
import InputErrorIcon from '../components/Icons/InputError';
import InputCompleteIcon from '../components/Icons/InputComplete';

const TextInput = ({
  value, label, placeholder, subtext, error, isSearch, inputWidth, isRequired,
}) => {
  const isIconExist = isSearch || error || value;
  return (
    <div className="text-input">
      <label>
        {
          <div className="text-input__labels-container">
            { label && <div className="text-input__label">{label}</div> }
            { isRequired && <div className="text-input__required-label">It needs to be filled <span role="img" aria-label="hugging face">🤗</span></div> }
          </div>
        }
        <div className="text-input__input-wrapper" style={{ width: inputWidth }}>
          <input
            value={value}
            className={classNames('text-input__input', {
              'text-input__input_error': Boolean(error),
              'text-input__input_with-icon': Boolean(isIconExist),
            })}
            type="text"
            placeholder={placeholder}
          />
          { isSearch && <div className="text-input__icon"><IconSearch /></div> }
          { error && <div className="text-input__icon"><InputErrorIcon /></div> }
          { value && <div className="text-input__icon"><InputCompleteIcon /></div> }
        </div>
      </label>
      { subtext && <div className="text-input__subtext">{subtext}</div> }
      { error && <div className="text-input__error">{error}</div> }
    </div>
  );
};

export default TextInput;
