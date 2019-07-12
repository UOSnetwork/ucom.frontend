import PropTypes from 'prop-types';
import React from 'react';
import { components } from 'react-select';
import urls from '../../utils/urls';
import { SOURCE_TYPE_EXTERNAL } from '../../utils/constants';
import { getUserName } from '../../utils/user';
import EntryCard from '../EntryCard';

const Option = props => (
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
        isExternal={props.data.sourceType === SOURCE_TYPE_EXTERNAL}
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

Option.propTypes = {
  selectProps: PropTypes.shape({
    organization: PropTypes.bool,
  }).isRequired,
  data: PropTypes.shape({
    sourceType: PropTypes.string,
    avatarFilename: PropTypes.string,
    title: PropTypes.string,
    sourceUrl: PropTypes.string,
    nickname: PropTypes.string,
    accountName: PropTypes.string,
  }).isRequired,
};

export default Option;
