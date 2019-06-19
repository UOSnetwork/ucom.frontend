import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import Close from './Icons/Close';
import api from '../api';
import { getUserName } from '../utils/user';
import urls from '../utils/urls';
import EntryCard from './EntryCard';
import { SOURCE_TYPE_EXTERNAL } from '../utils/constants';

const SelectUserOption = props => (
  <components.Option {...props}>
    {props.selectProps.organization ? (
      <EntryCard
        disabledLink
        disableRate
        organization
        disableSign={props.data.sourceType === SOURCE_TYPE_EXTERNAL}
        avatarSrc={urls.getFileUrl(props.data.avatarFilename)}
        title={props.data.title}
        nickname={props.data.sourceType === SOURCE_TYPE_EXTERNAL ? props.data.sourceUrl : props.data.nickname}
      />
    ) : (
      <EntryCard
        disabledLink
        disableRate
        avatarSrc={urls.getFileUrl(props.data.avatarFilename)}
        title={getUserName(props.data)}
        nickname={props.data.accountName}
      />
    )}
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

const Input = props => (
  <div className="dropdown__input-container">
    <components.Input {...props} />
  </div>
);

const UserSearchInput = ({
  onChange,
  value,
  isMulti,
  placeholder,
  loadOptions,
  autoFocus,
  organization,
}) => (
  <div className="dropdown">
    <AsyncSelect
      autoFocus={autoFocus}
      value={value}
      isMulti={isMulti}
      isSearchable
      isClearable={false}
      placeholder={placeholder}
      className="dropdown"
      classNamePrefix="dropdown"
      loadOptions={loadOptions}
      getOptionLabel={data => getUserName(data)}
      getOptionValue={data => data.id}
      organization={organization}
      components={{
        Input,
        Control,
        DropdownIndicator,
        MultiValueRemove: CloseButton,
        Option: SelectUserOption,
      }}
      onChange={(options) => {
        if (onChange) {
          onChange(options);
        }
      }}
    />
  </div>
);

UserSearchInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
  loadOptions: PropTypes.func,
  autoFocus: PropTypes.bool,
  organization: PropTypes.bool,
};

UserSearchInput.defaultProps = {
  isMulti: true,
  placeholder: 'Find people',
  onChange: undefined,
  value: undefined,
  autoFocus: false,
  organization: false,
  loadOptions: async (q) => {
    try {
      const data = await api.searchUsers(q);
      return data.slice(0, 20);
    } catch (err) {
      return [];
    }
  },
};

export default UserSearchInput;
