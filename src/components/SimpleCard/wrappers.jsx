import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import SimpleCard from './index';
import { selectUserById } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { formatScaledImportance } from '../../utils/rate';
import equalByProps from '../../utils/equalByProps';

export const UserCard = memo(({ userId }) => {
  const user = useSelector(
    selectUserById(userId),
    equalByProps(['avatarFilename', 'scaledImportance', 'id', 'firstName', 'accountName']),
  );

  if (!user) {
    return null;
  }

  return (
    <SimpleCard
      userPickSrc={urls.getFileUrl(user.avatarFilename)}
      userPickAlt={getUserName(user)}
      name={getUserName(user)}
      rate={formatScaledImportance(user.scaledImportance)}
      url={urls.getUserUrl(user.id)}
    />
  );
});

UserCard.propTypes = {
  userId: PropTypes.number.isRequired,
};
