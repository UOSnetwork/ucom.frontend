import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, useEffect, Fragment } from 'react';
import Tabs from './Tabs';
import FeedView from '../FeedView';
import graphql from '../../../api/graphql';
import { MAIN_FEED_ID } from '../../../utils/feed';
import { addPostsAndComments } from '../../../actions/feed';
import { addUsers } from '../../../actions/users';
import { addErrorNotification } from '../../../actions/notifications';
import withLoader from '../../../utils/withLoader';
import EntryListSection from '../../EntryListSection';
import { getUsersByIds } from '../../../store/users';
import urls from '../../../utils/urls';
import { getUserName } from '../../../utils/user';
import { getOrganizationByIds } from '../../../store/organizations';
import { addOrganizations } from '../../../actions/organizations';
import { addTags } from '../../../actions/tags';
import { getTagsByTitle } from '../../../store/tags';
import CommunityBanner from '../../CommunityBanner';

const SIDEBAR_ENTRY_LIST_LIMIT = 8;

const FeedMain = ({
  dispatch, users, organizations, tags,
}) => {
  const [activeTabId, setActiveTabId] = useState();

  const [feedState, setFeedState] = useState({
    userIds: [],
    postsIds: [],
    organizationsIds: [],
    tagsIds: [],
    loading: false,
    hasMore: false,
    page: 1,
  });

  const [usersPopupState, setUsersPopupState] = useState({
    ids: [],
    metadata: {},
  });

  const [organizationsPopupState, setOrganizationsPopupState] = useState({
    ids: [],
    metadata: {},
  });

  const [tagsPopupState, setTagsPopupState] = useState({
    ids: [],
    metadata: {},
  });

  const getFeed = async ({
    page = 1,
  }) => {
    setFeedState(prev => ({ ...prev, loading: true }));

    try {
      const data = await withLoader(graphql.getPosts({ page }));
      const {
        manyPosts, manyUsers, manyOrganizations, manyTags,
      } = data;

      setFeedState(prev => ({
        ...prev,
        page,
        hasMore: manyPosts.metadata.hasMore,
        postsIds: prev.postsIds.concat(manyPosts.data.map(i => i.id)),
        userIds: manyUsers.data.map(i => i.id),
        tagsIds: manyTags.data.map(i => i.title),
        organizationsIds: manyOrganizations.data.map(i => i.id),
      }));

      setUsersPopupState(() => ({
        ids: manyUsers.data.map(i => i.id),
        metadata: manyUsers.metadata,
      }));

      setOrganizationsPopupState(() => ({
        ids: manyOrganizations.data.map(i => i.id),
        metadata: manyOrganizations.metadata,
      }));

      setTagsPopupState(() => ({
        ids: manyTags.data.map(i => i.title),
        metadata: manyTags.metadata,
      }));

      dispatch(addPostsAndComments(manyPosts.data));
      dispatch(addUsers(manyUsers.data));
      dispatch(addOrganizations(manyOrganizations.data));
      dispatch(addTags(manyTags.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }

    setFeedState(prev => ({ ...prev, loading: false }));
  };

  const getUsersForPopup = async (page) => {
    try {
      const data = await withLoader(graphql.getPosts({ page }));
      const { manyUsers } = data;
      setUsersPopupState(() => ({
        ids: manyUsers.data.map(user => user.id),
        metadata: manyUsers.metadata,
      }));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const getOrganizationsForPopup = async (page) => {
    try {
      const data = await withLoader(graphql.getPosts({ page }));
      const { manyOrganizations } = data;
      setUsersPopupState(() => ({
        ids: manyOrganizations.data.map(i => i.id),
        metadata: manyOrganizations.metadata,
      }));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const getTagsForPopup = async (page) => {
    try {
      const data = await withLoader(graphql.getPosts({ page }));
      const { manyTags } = data;
      setTagsPopupState(() => ({
        ids: manyTags.data.map(i => i.id),
        metadata: manyTags.metadata,
      }));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const onClickLoadMore = () => {
    getFeed({ page: feedState.page + 1 });
  };

  useEffect(() => {
    getFeed({ page: feedState.page });
  }, []);

  return (
    <Fragment>
      <div className="grid grid_content">
        <div className="grid__item grid__item_main">
          <Tabs
            activeTabId={activeTabId}
            onClickItem={setActiveTabId}
          />
        </div>
      </div>

      <div className="grid grid_content">
        <div className="grid__item grid__item_main">
          <FeedView
            feedTypeId={MAIN_FEED_ID}
            postIds={feedState.postsIds}
            loading={feedState.loading}
            hasMore={feedState.hasMore}
            onClickLoadMore={onClickLoadMore}
          />
        </div>
        <div className="grid__item grid__item_side">
          <CommunityBanner />

          <EntryListSection
            title="Top Users of the Day"
            limit={SIDEBAR_ENTRY_LIST_LIMIT}
            data={getUsersByIds(users, feedState.userIds).map(user => ({
              id: user.id,
              avatarSrc: urls.getFileUrl(user.avatarFilename),
              url: urls.getUserUrl(user.id),
              title: getUserName(user),
              nickname: user.accountName,
              currentRate: user.currentRate,
            }))}
            popupData={getUsersByIds(users, usersPopupState.ids).map(user => ({
              id: user.id,
              avatarSrc: urls.getFileUrl(user.avatarFilename),
              url: urls.getUserUrl(user.id),
              title: getUserName(user),
              nickname: user.accountName,
              currentRate: user.currentRate,
            }))}
            popupMetadata={usersPopupState.metadata}
            onChangePage={getUsersForPopup}
          />

          <EntryListSection
            title="Most Buzzin’ Communities"
            limit={SIDEBAR_ENTRY_LIST_LIMIT}
            data={getOrganizationByIds(organizations, feedState.organizationsIds).map(organization => ({
              organization: true,
              id: organization.id,
              avatarSrc: urls.getFileUrl(organization.avatarFilename),
              url: urls.getOrganizationUrl(organization.id),
              title: organization.title,
              nickname: organization.nickname,
              currentRate: organization.currentRate,
            }))}
            popupData={getOrganizationByIds(organizations, organizationsPopupState.ids).map(organization => ({
              organization: true,
              id: organization.id,
              avatarSrc: urls.getFileUrl(organization.avatarFilename),
              url: urls.getOrganizationUrl(organization.id),
              title: organization.title,
              nickname: organization.nickname,
              currentRate: organization.currentRate,
            }))}
            popupMetadata={organizationsPopupState.metadata}
            onChangePage={getOrganizationsForPopup}
          />

          <EntryListSection
            title="Popular Today"
            limit={SIDEBAR_ENTRY_LIST_LIMIT}
            data={getTagsByTitle(tags, feedState.tagsIds).map(tag => ({
              id: tag.id,
              url: urls.getTagUrl(tag.title),
              title: `#${tag.title}`,
              nickname: pluralize('posts', tag.currentPostsAmount, true),
              currentRate: tag.currentRate,
              disableSign: true,
              disableAvatar: true,
            }))}
            popupData={getTagsByTitle(tags, tagsPopupState.ids).map(tag => ({
              id: tag.id,
              url: urls.getTagUrl(tag.title),
              title: `#${tag.title}`,
              nickname: pluralize('posts', tag.currentPostsAmount, true),
              currentRate: tag.currentRate,
              disableSign: true,
              disableAvatar: true,
            }))}
            popupMetadata={tagsPopupState.metadata}
            onChangePage={getTagsForPopup}
          />
        </div>
      </div>
    </Fragment>
  );
};

FeedMain.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  tags: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(state => ({
  users: state.users,
  organizations: state.organizations,
  tags: state.tags,
}))(FeedMain);
