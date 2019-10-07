import PropTypes from 'prop-types';
import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import api from '../../api';
import { getUserName } from '../../utils/user';
import withLoader from '../../utils/withLoader';
import Option from './Option';
import styles from './styles.css';

const SearchInput = ({
  value,
  isMulti,
  placeholder,
  loadOptions,
  autoFocus,
  organization,
  onChange,
  getOptionLabel,
  getOptionValue,
  isDisabled,
}) => (
  <AsyncSelect
    isDisabled={isDisabled}
    isSearchable
    autoFocus={autoFocus}
    placeholder={placeholder}
    isMulti={isMulti}
    value={value}
    organization={organization}
    isClearable={false}
    loadOptions={loadOptions}
    onChange={onChange}
    className={styles.wrapper}
    classNamePrefix="searchInput"
    getOptionLabel={getOptionLabel}
    getOptionValue={getOptionValue}
    components={{
      Option,
    }}
  />
);

SearchInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
  loadOptions: PropTypes.func,
  autoFocus: PropTypes.bool,
  organization: PropTypes.bool,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  isDisabled: PropTypes.bool,
};

SearchInput.defaultProps = {
  isMulti: true,
  placeholder: 'Find people',
  onChange: undefined,
  value: undefined,
  autoFocus: false,
  organization: false,
  loadOptions: q => withLoader(api.searchUsersByAccountNameWithLimit(q, 20)),
  getOptionLabel: getUserName,
  getOptionValue: data => data.id,
  isDisabled: false,
};

export default SearchInput;
