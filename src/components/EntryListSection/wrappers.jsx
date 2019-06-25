import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import React from 'react';
import { useSelector } from 'react-redux';
import EntryListSection from './index';
import { selectUsersByIds, selectOrgsByIds, selectTagsByTitles } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';

export const EntryListSectionUsersWrapper = (props) => {
  const users = useSelector(selectUsersByIds(props.ids));
  let popupUsers;

  if (props.popupIds) {
    popupUsers = useSelector(selectUsersByIds(props.popupIds));
  }


  const mapProps = user => ({
    id: user.id,
    avatarSrc: urls.getFileUrl(user.avatarFilename),
    url: urls.getUserUrl(user.id),
    title: getUserName(user),
    nickname: user.accountName,
    scaledImportance: user.scaledImportance,
  });

  return (
    <EntryListSection
      {...props}
      data={sortBy(users, ['scaledImportance']).reverse().map(mapProps)}
      popupData={popupUsers ? popupUsers.map(mapProps) : undefined}
    />
  );
};

EntryListSectionUsersWrapper.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number),
  popupIds: PropTypes.arrayOf(PropTypes.number),
};

EntryListSectionUsersWrapper.defaultProps = {
  ids: [],
  popupIds: undefined,
};

export const EntryListSectionOrgsWrapper = (props) => {
  const orgs = useSelector(selectOrgsByIds(props.ids));
  let popupOrgs;

  if (props.popupIds) {
    popupOrgs = useSelector(selectOrgsByIds(props.popupIds));
  }

  const mapProps = org => ({
    organization: true,
    id: org.id,
    avatarSrc: urls.getFileUrl(org.avatarFilename),
    url: urls.getOrganizationUrl(org.id),
    title: org.title,
    nickname: org.nickname,
    currentRate: org.currentRate,
  });

  return (
    <EntryListSection
      {...props}
      data={sortBy(orgs, ['currentRate']).reverse().map(mapProps)}
      popupData={popupOrgs ? popupOrgs.map(mapProps) : undefined}
    />
  );
};

EntryListSectionOrgsWrapper.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number),
  popupIds: PropTypes.arrayOf(PropTypes.number),
};

EntryListSectionOrgsWrapper.defaultProps = {
  ids: [],
  popupIds: [],
};

export const EntryListSectionTagsWrapper = (props) => {
  const tags = useSelector(selectTagsByTitles(props.titles));
  let popupTags;

  if (props.popupTitles) {
    popupTags = useSelector(selectTagsByTitles(props.popupTitles));
  }

  const mapProps = tag => ({
    id: tag.id,
    url: urls.getTagUrl(tag.title),
    title: `#${tag.title}`,
    nickname: pluralize('posts', tag.currentPostsAmount, true),
    currentRate: tag.currentRate,
    disableSign: true,
    disableAvatar: true,
  });

  return (
    <EntryListSection
      {...props}
      data={sortBy(tags, ['currentRate']).reverse().map(mapProps)}
      popupData={popupTags ? popupTags.map(mapProps) : []}
    />
  );
};

EntryListSectionTagsWrapper.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
  popupTitles: PropTypes.arrayOf(PropTypes.string),
};

EntryListSectionTagsWrapper.defaultProps = {
  titles: [],
  popupTitles: undefined,
};
