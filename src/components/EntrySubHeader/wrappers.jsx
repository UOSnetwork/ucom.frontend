import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserById, selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import EntrySubHeader from './index';

export const UserSubHeader = ({ userId }) => {
  const user = useSelector(selectUserById(userId), isEqual);
  const owner = useSelector(selectOwner, isEqual);

  if (!user) {
    return null;
  }

  return (
    <EntrySubHeader
      showFollow={user.id !== owner.id}
      userUrl={urls.getUserUrl(userId)}
      userName={getUserName(user)}
      userAvatarUrl={urls.getFileUrl(user.avatarFilename)}
      userId={userId}
      userRate={user.scaledImportance}
    />
  );
};

UserSubHeader.propTypes = {
  userId: PropTypes.number.isRequired,
};
