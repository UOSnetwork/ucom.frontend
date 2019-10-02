import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ isChecked, onChange, isDisabled }) => (
  <div className={`checkbox-input ${isDisabled ? 'checkbox-input_disabled' : ''}`}>
    <label className="checkbox-input__label">
      <input
        type="checkbox"
        className="checkbox-input__input"
        value={isChecked}
        checked={isChecked ? 'checked' : ''}
        disabled={isDisabled}
        onChange={(e) => {
          if (typeof onChange === 'function') {
            onChange(e.target.checked);
          }
        }}
      />

      <div className="checkbox-input__checkmark" />
    </label>
  </div>
);

Checkbox.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  isChecked: false,
  onChange: undefined,
  isDisabled: false,
};

export default Checkbox;
