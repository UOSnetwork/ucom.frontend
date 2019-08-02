import PropTypes from 'prop-types';
import React from 'react';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { selectUserById, selectOrgById } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import EntryCard from './index';

export const UserCard = ({ userId, disabledLink, disableRate }) => {
  const user = useSelector(selectUserById(userId), isEqual);

  if (!user) {
    return null;
  }

  return (
    <EntryCard
      avatarSrc={urls.getFileUrl(user.avatarFilename)}
      url={urls.getUserUrl(user.id)}
      title={getUserName(user)}
      nickname={user.accountName}
      scaledImportance={user.scaledImportance}
      disabledLink={disabledLink}
      disableRate={disableRate}
    />
  );
};

UserCard.propTypes = {
  userId: PropTypes.number.isRequired,
  disabledLink: PropTypes.bool,
  disableRate: PropTypes.bool,
};

UserCard.defaultProps = {
  disabledLink: false,
  disableRate: false,
};

export const OrgCard = ({ orgId, disabledLink, disableRate }) => {
  const org = useSelector(selectOrgById(orgId), isEqual);

  if (!org) {
    return null;
  }

  return (
    <EntryCard
      organization
      avatarSrc={urls.getFileUrl(org.avatarFilename)}
      url={urls.getOrganizationUrl(org.id)}
      title={org.title}
      nickname={org.nickname}
      currentRate={org.currentRate}
      disabledLink={disabledLink}
      disableRate={disableRate}
    />
  );
};

OrgCard.propTypes = {
  orgId: PropTypes.number.isRequired,
  disabledLink: PropTypes.bool,
  disableRate: PropTypes.bool,
};

OrgCard.defaultProps = {
  disabledLink: false,
  disableRate: false,
};
