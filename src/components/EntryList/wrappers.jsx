import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React from 'react';
import { selectUsersByIds } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import EntryList from './index';

export const UsersEntryList = ({ ids }) => {
  const users = useSelector(selectUsersByIds(ids));

  return (
    <EntryList
      limit={ids.length}
      data={users.map(user => ({
        id: user.id,
        avatarSrc: urls.getFileUrl(user.avatarFilename),
        url: urls.getUserUrl(user.id),
        title: getUserName(user),
        nickname: user.accountName,
        scaledImportance: user.scaledImportance,
      }))}
    />
  );
};

UsersEntryList.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
};
