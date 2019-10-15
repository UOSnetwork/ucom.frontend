import { sortBy, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import React from 'react';
import { useSelector } from 'react-redux';
import EntryListSection from './index';
import { selectUsersByIds, selectOrgsByIds, selectTagsByTitles, selectOrgById } from '../../store/selectors';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { SOURCE_TYPE_EXTERNAL, USERS_TEAM_STATUS_ID_CONFIRMED } from '../../utils/constants';
import { extractHostname } from '../../utils/url';

export const EntryListSectionUsersWrapper = (props) => {
  const users = useSelector(selectUsersByIds(props.ids), isEqual);
  let popupUsers;

  if (props.popupIds) {
    popupUsers = useSelector(selectUsersByIds(props.popupIds), isEqual);
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
  const orgs = useSelector(selectOrgsByIds(props.ids), isEqual);
  let popupOrgs;

  if (props.popupIds) {
    popupOrgs = useSelector(selectOrgsByIds(props.popupIds), isEqual);
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
      followButtonEnabled={false}
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
  const tags = useSelector(selectTagsByTitles(props.titles), isEqual);
  let popupTags;

  if (props.popupTitles) {
    popupTags = useSelector(selectTagsByTitles(props.popupTitles), isEqual);
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

export const EntryListSectionOrgSourcesWrapper = ({ orgId, ...props }) => {
  const org = useSelector(selectOrgById(orgId), isEqual) || {};
  const sources = [
    ...(org.communitySources || []),
    ...(org.partnershipSources || []),
  ];

  const isExternalSource = source => source.sourceType === SOURCE_TYPE_EXTERNAL;

  const mapProps = item => ({
    id: item.id,
    organization: isExternalSource(item) || (item.entityName && item.entityName.trim() === 'org'),
    avatarSrc: urls.getFileUrl(item.avatarFilename),
    url: urls.getSourceUrl(item),
    title: item.title,
    nickname: isExternalSource(item) ? extractHostname(item.sourceUrl) : item.nickname,
    disableRate: true,
    disableSign: isExternalSource(item),
    isExternal: isExternalSource(item),
  });

  return (
    <EntryListSection
      {...props}
      followButtonEnabled={false}
      title="Partners"
      count={sources.length}
      data={sources.map(mapProps)}
    />
  );
};

EntryListSectionOrgSourcesWrapper.propTypes = {
  orgId: PropTypes.number.isRequired,
};

export const EntryListSectionOrgAdminsWrapper = ({ orgId, ...props }) => {
  const org = useSelector(selectOrgById(orgId), isEqual) || {};

  const users = [
    ...(org.user ? [org.user] : []),
    ...(org.usersTeam || []).filter(i => i.usersTeamStatus === USERS_TEAM_STATUS_ID_CONFIRMED),
  ];

  const mapProps = item => ({
    id: item.id,
    avatarSrc: urls.getFileUrl(item.avatarFilename),
    url: urls.getUserUrl(item.id),
    title: getUserName(item),
    nickname: item.accountName,
    scaledImportance: item.scaledImportance,
    follow: true,
  });

  return (
    <EntryListSection
      {...props}
      title="Administrators"
      count={users.length}
      data={users.map(mapProps)}
    />
  );
};

EntryListSectionOrgAdminsWrapper.propTypes = {
  orgId: PropTypes.number.isRequired,
};
