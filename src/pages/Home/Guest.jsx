import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, useEffect, Fragment } from 'react';
import Tabs, { TAB_ID_PEOPLE, TAB_ID_COMMUNITIES } from '../../components/Feed/Tabs';
import FeedView from '../../components/Feed/FeedView';
import graphql from '../../api/graphql';
import { MAIN_FEED_ID } from '../../utils/feed';
import { addPostsAndComments } from '../../actions/feed';
import { addUsers } from '../../actions/users';
import { addErrorNotification } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';
import EntryListSection from '../..//components/EntryListSection';
import { getUsersByIds } from '../../store/users';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { getOrganizationByIds } from '../../store/organizations';
import { addOrganizations } from '../../actions/organizations';
import { addTags } from '../../actions/tags';
import { getTagsByTitle } from '../../store/tags';
import CommunityBanner from '../../components/CommunityBanner';
import { sortByRate } from '../../utils/list';
import PostsGrid from '../../components/PostsGrid';
import { ENTITY_NAMES_USERS, ENTITY_NAMES_ORG, POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID } from '../../utils/posts';

const SIDEBAR_ENTRY_LIST_LIMIT = 8;

const Guest = ({
  dispatch, users, organizations, tags,
}) => {
  const [state, setState] = useState({
    activeTabId: TAB_ID_PEOPLE,
    feed: {
      userIds: [],
      postsIds: [],
      organizationsIds: [],
      tagsIds: [],
      loading: false,
      hasMore: false,
      page: 1,
    },
    usersPopup: {
      ids: [],
      metadata: {},
    },
    organizationsPopup: {
      ids: [],
      metadata: {},
    },
    tagsPopup: {
      ids: [],
      metadata: {},
    },
    topPosts: [],
  });

  const getTopPosts = async () => {
    try {
      const data = await withLoader(graphql.getPostsFeed({
        postTypeIds: [POST_TYPE_MEDIA_ID],
        entityNamesFrom: state.activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
        entityNamesFor: state.activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
        orderBy: '-current_rate',
      }));
      setState(prev => ({ ...prev, topPosts: data.data }));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const getPageData = async () => {
    setState(prev => ({
      ...prev,
      feed: {
        ...prev.feed,
        loading: true,
      },
    }));

    try {
      const data = await withLoader(graphql.getMainPageData({
        postsFeedParams: {
          page: 1,
          postTypeIds: [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID],
          entityNamesFrom: state.activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
          entityNamesFor: state.activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
          orderBy: '-id',
          commentsPage: 1,
          commentsPerPage: 3,
        },
      }));

      const {
        postsFeed, manyUsers, manyOrganizations, manyTags,
      } = data;

      setState(prev => ({
        ...prev,
        feed: {
          ...prev.feed,
          page: 1,
          hasMore: postsFeed.metadata.hasMore,
          postsIds: postsFeed.data.map(i => i.id),
          userIds: manyUsers.data.map(i => i.id),
          organizationsIds: manyOrganizations.data.map(i => i.id),
          tagsIds: manyTags.data.map(i => i.title),
        },
        usersPopup: {
          ids: manyUsers.data.map(i => i.id),
          metadata: manyUsers.metadata,
        },
        organizationsPopup: {
          ids: manyOrganizations.data.map(i => i.id),
          metadata: manyOrganizations.metadata,
        },
        tagsPopup: {
          ids: manyTags.data.map(i => i.title),
          metadata: manyTags.metadata,
        },
      }));

      dispatch(addPostsAndComments(postsFeed.data));
      dispatch(addUsers(manyUsers.data));
      dispatch(addOrganizations(manyOrganizations.data));
      dispatch(addTags(manyTags.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }

    setState(prev => ({
      ...prev,
      feed: {
        ...prev.feed,
        loading: false,
      },
    }));
  };

  const getFeed = async (page) => {
    setState(prev => ({
      ...prev,
      feed: {
        ...prev.feed,
        loading: true,
      },
    }));

    try {
      const postsFeed = await withLoader(graphql.getPostsFeed({
        page,
        postTypeIds: [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID],
        entityNamesFrom: state.activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
        entityNamesFor: state.activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
        orderBy: '-id',
        commentsPage: 1,
        commentsPerPage: 3,
      }));

      setState(prev => ({
        ...prev,
        feed: {
          ...prev.feed,
          page,
          hasMore: postsFeed.metadata.hasMore,
          postsIds: prev.feed.postsIds.concat(postsFeed.data.map(i => i.id)),
        },
      }));

      dispatch(addPostsAndComments(postsFeed.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }

    setState(prev => ({
      ...prev,
      feed: {
        ...prev.feed,
        loading: false,
      },
    }));
  };

  const getUsersForPopup = async (page) => {
    try {
      const data = await withLoader(graphql.getManyUsers({ page }));
      setState(prev => ({
        ...prev,
        usersPopup: {
          ids: data.data.map(user => user.id),
          metadata: data.metadata,
        },
      }));
      dispatch(addUsers(data.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const getOrganizationsForPopup = async (page) => {
    try {
      const data = await withLoader(graphql.getTrendingOrganizations({ page }));
      setState(prev => ({
        ...prev,
        organizationsPopup: {
          ids: data.manyOrganizations.data.map(org => org.id),
          metadata: data.manyOrganizations.metadata,
        },
      }));
      dispatch(addOrganizations(data.manyOrganizations.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const getTagsForPopup = async (page) => {
    try {
      const data = await withLoader(graphql.getTrendingTags({ page }));
      setState(prev => ({
        ...prev,
        tagsPopup: {
          ids: data.manyTags.data.map(tag => tag.title),
          metadata: data.manyTags.metadata,
        },
      }));
      dispatch(addTags(data.manyTags.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  const usersSection = (
    <EntryListSection
      title={state.activeTabId === TAB_ID_COMMUNITIES ? 'Recent Top Authors' : 'Top Users of the Day'}
      limit={SIDEBAR_ENTRY_LIST_LIMIT}
      data={sortByRate(getUsersByIds(users, state.feed.userIds)).map(user => ({
        id: user.id,
        avatarSrc: urls.getFileUrl(user.avatarFilename),
        url: urls.getUserUrl(user.id),
        title: getUserName(user),
        nickname: user.accountName,
        currentRate: user.currentRate,
      }))}
      popupData={getUsersByIds(users, state.usersPopup.ids).map(user => ({
        id: user.id,
        avatarSrc: urls.getFileUrl(user.avatarFilename),
        url: urls.getUserUrl(user.id),
        title: getUserName(user),
        nickname: user.accountName,
        currentRate: user.currentRate,
      }))}
      popupMetadata={state.usersPopup.metadata}
      onChangePage={getUsersForPopup}
    />
  );

  const communitiesSections = (
    <EntryListSection
      title={state.activeTabId === TAB_ID_COMMUNITIES ? 'Top Communities This Week' : 'Most Buzzin’ Communities'}
      limit={SIDEBAR_ENTRY_LIST_LIMIT}
      data={sortByRate(getOrganizationByIds(organizations, state.feed.organizationsIds)).map(organization => ({
        organization: true,
        id: organization.id,
        avatarSrc: urls.getFileUrl(organization.avatarFilename),
        url: urls.getOrganizationUrl(organization.id),
        title: organization.title,
        nickname: organization.nickname,
        currentRate: organization.currentRate,
      }))}
      popupData={getOrganizationByIds(organizations, state.organizationsPopup.ids).map(organization => ({
        organization: true,
        id: organization.id,
        avatarSrc: urls.getFileUrl(organization.avatarFilename),
        url: urls.getOrganizationUrl(organization.id),
        title: organization.title,
        nickname: organization.nickname,
        currentRate: organization.currentRate,
      }))}
      popupMetadata={state.organizationsPopup.metadata}
      onChangePage={getOrganizationsForPopup}
    />
  );

  const onClickLoadMore = () => {
    getFeed(state.feed.page + 1);
  };

  useEffect(() => {
    getPageData();
    getTopPosts();
  }, [state.activeTabId]);

  return (
    <Fragment>
      <PostsGrid posts={state.topPosts} />

      <div className="content">
        <div className="content__inner">
          <div className="grid grid_content">
            <div className="grid__item grid__item_main">
              <Tabs
                activeTabId={state.activeTabId}
                onClickItem={(activeTabId) => {
                  setState(prev => ({ ...prev, activeTabId }));
                }}
              />
            </div>
          </div>
        </div>
        <div className="content__inner">
          <div className="grid grid_content">
            <div className="grid__item grid__item_main">
              <FeedView
                feedTypeId={MAIN_FEED_ID}
                postIds={state.feed.postsIds}
                loading={state.feed.loading}
                hasMore={state.feed.hasMore}
                onClickLoadMore={onClickLoadMore}
              />
            </div>
            <div className="grid__item grid__item_side">
              <CommunityBanner
                forCommunity={state.activeTabId === TAB_ID_COMMUNITIES}
              />

              {state.activeTabId === TAB_ID_COMMUNITIES ? (
                <Fragment>
                  {communitiesSections}
                  {usersSection}
                </Fragment>
              ) : (
                <Fragment>
                  {usersSection}
                  {communitiesSections}
                </Fragment>
              )}

              <EntryListSection
                title="Popular Today"
                limit={SIDEBAR_ENTRY_LIST_LIMIT}
                data={sortByRate(getTagsByTitle(tags, state.feed.tagsIds)).map(tag => ({
                  id: tag.id,
                  url: urls.getTagUrl(tag.title),
                  title: `#${tag.title}`,
                  nickname: pluralize('posts', tag.currentPostsAmount, true),
                  currentRate: tag.currentRate,
                  disableSign: true,
                  disableAvatar: true,
                }))}
                popupData={getTagsByTitle(tags, state.tagsPopup.ids).map(tag => ({
                  id: tag.id,
                  url: urls.getTagUrl(tag.title),
                  title: `#${tag.title}`,
                  nickname: pluralize('posts', tag.currentPostsAmount, true),
                  currentRate: tag.currentRate,
                  disableSign: true,
                  disableAvatar: true,
                }))}
                popupMetadata={state.tagsPopup.metadata}
                onChangePage={getTagsForPopup}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Guest.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  tags: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(state => ({
  users: state.users,
  organizations: state.organizations,
  tags: state.tags,
}))(Guest);
