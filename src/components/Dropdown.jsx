import React from 'react';
import classNames from 'classnames';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import UserOption from './UserOption';
import Close from './Icons/Close';

// TODO: Remove

const SelectUserOption = props => (
  <components.Option {...props}>
    <UserOption
      name={props.label}
      linkColor={props.data.isEnvited && 'red'}
      linkText={props.data.isEnvited ? 'Invite' : 'Invite sent'}
      avatar={props.data.avatar}
    />
  </components.Option>
);

const CloseButton = props => (
  <components.MultiValueRemove {...props}>
    <div className="dropdown__multi-value__remove">
      <Close size={9} />
    </div>
  </components.MultiValueRemove>
);

const Control = props => (
  <div
    className={classNames(
      'dropdown__control-wrapper',
      { 'dropdown__control-wrapper_opened': props.selectProps.menuIsOpen },
    )}
  >
    <components.Control {...props} />
  </div>
);

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <div
      className={classNames(
        'dropdown__arrow',
        { 'dropdown__arrow_up': props.selectProps.menuIsOpen },
      )}
    />
  </components.DropdownIndicator>
);

const Dropdown = ({
  label, options, subtext, isMulti, isSearchable = false, placeholder, isUserOptions,
}) => (
  <div className="dropdown">
    { label && <div className="dropdown__label">{label}</div> }
    <Select
      options={options}
      isMulti={isMulti}
      placeholder={placeholder || ''}
      className="dropdown"
      classNamePrefix="dropdown"
      isSearchable={isSearchable}
      isClearable={false}
      components={{
        MultiValueRemove: CloseButton,
        Control,
        DropdownIndicator,
        [isUserOptions ? 'Option' : '']: SelectUserOption,
      }}
    />
    { subtext && <div className="dropdown__subtext">{subtext}</div>}
  </div>
);

const selectProps = {
  label: PropTypes.string,
  avatar: PropTypes.string,
  data: PropTypes.shape({
    avatar: PropTypes.string,
    isEnvited: PropTypes.bool,
  }),
  selectProps: PropTypes.shape({
    menuIsOpen: PropTypes.bool,
  }),
};

Control.propTypes = selectProps;
SelectUserOption.propTypes = selectProps;
DropdownIndicator.propTypes = selectProps;

Dropdown.propTypes = {
  label: PropTypes.string,
  subtext: PropTypes.string,
  placeholder: PropTypes.string,
  isUserOptions: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    isEnvited: PropTypes.bool,
  })),
};

export default Dropdown;
