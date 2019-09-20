import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserById, selectOwner, selectOrgById } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import EntrySubHeader from './index';
import { formatScaledImportance, formatRate } from '../../utils/rate';

export const UserSubHeader = ({ userId, ...props }) => {
  const user = useSelector(selectUserById(userId), isEqual);
  const owner = useSelector(selectOwner, isEqual);

  if (!user) {
    return null;
  }

  return (
    <EntrySubHeader
      {...props}
      userPick={urls.getUserUrl(userId)}
      name={getUserName(user)}
      url={urls.getUserUrl(userId)}
      rate={formatScaledImportance(user.scaledImportance)}
      userId={user.id}
      showFollow={user.id !== owner.id}
      avatarSrc={urls.getFileUrl(user.avatarFilename)}
    />
  );
};

UserSubHeader.propTypes = {
  userId: PropTypes.number.isRequired,
};

export const OrgSubHeader = ({ orgId, ...props }) => {
  const org = useSelector(selectOrgById(orgId), isEqual);

  if (!org) {
    return null;
  }

  return (
    <EntrySubHeader
      {...props}
      avatarSrc={urls.getFileUrl(org.avatarFilename)}
      name={org.title}
      url={urls.getOrganizationUrl(org.id)}
      rate={formatRate(org.currentRate, true)}
      orgId={orgId}
      showFollow={PropTypes.bool}
    />
  );
};

OrgSubHeader.propTypes = {
  orgId: PropTypes.number.isRequired,
};
