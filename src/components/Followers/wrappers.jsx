import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import Followers from './index';
import { selectUsersByIds } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';

export const FollowersWrapper = ({ usersIds, popupUsersIds, ...props }) => {
  const users = useSelector(selectUsersByIds(usersIds), isEqual);
  const popupUsers = useSelector(selectUsersByIds(popupUsersIds), isEqual);

  const mapProps = user => ({
    id: user.id,
    follow: true,
    avatarSrc: urls.getFileUrl(user.avatarFilename),
    url: urls.getUserUrl(user.id),
    title: getUserName(user),
    nickname: user.accountName,
    scaledImportance: user.scaledImportance,
  });

  return (
    <Followers
      {...props}
      users={users.map(mapProps)}
      popupUsers={popupUsers.map(mapProps)}
    />
  );
};

FollowersWrapper.propTypes = {
  usersIds: PropTypes.arrayOf(PropTypes.number),
  popupUsersIds: PropTypes.arrayOf(PropTypes.number),
};

FollowersWrapper.defaultProps = {
  usersIds: [],
  popupUsersIds: [],
};
