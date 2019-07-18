import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React from 'react';
import { selectUsersByIds, selectOrgsByIds, selectTagsByTitles } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import EntryList from './index';

export const UsersEntryList = ({ ids }) => {
  const users = useSelector(selectUsersByIds(ids));

  return (
    <EntryList
      limit={users.length}
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

export const OrgsEntryList = ({ ids }) => {
  const orgs = useSelector(selectOrgsByIds(ids));

  return (
    <EntryList
      limit={orgs.length}
      data={orgs.map(org => ({
        organization: true,
        id: org.id,
        avatarSrc: urls.getFileUrl(org.avatarFilename),
        url: urls.getOrganizationUrl(org.id),
        title: org.title,
        nickname: org.nickname,
        currentRate: org.currentRate,
      }))}
    />
  );
};

OrgsEntryList.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export const TagsEntryList = ({ titles }) => {
  const tags = useSelector(selectTagsByTitles(titles));

  return (
    <EntryList
      limit={tags.length}
      data={tags.map(tag => ({
        id: tag.id,
        url: urls.getTagUrl(tag.title),
        title: `#${tag.title}`,
        nickname: pluralize('posts', tag.currentPostsAmount, true),
        currentRate: tag.currentRate,
        disableSign: true,
        disableAvatar: true,
      }))}
    />
  );
};

TagsEntryList.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
