import pluralize from 'pluralize';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, Fragment } from 'react';
import Tabs, { TAB_ID_COMMUNITIES } from '../../components/Feed/Tabs';
import FeedView from '../../components/Feed/FeedView';
import { MAIN_FEED_ID } from '../../utils/feed';
import { addErrorNotification } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';
import EntryListSection from '../..//components/EntryListSection';
import { getUsersByIds } from '../../store/users';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { getOrganizationByIds } from '../../store/organizations';
import { getTagsByTitle } from '../../store/tags';
import { getPostByIds } from '../../store/posts';
import CommunityBanner from '../../components/CommunityBanner';
import { sortByRate } from '../../utils/list';
import PostsGrid from '../../components/PostsGrid';
import * as mainPageActions from '../../actions/mainPage';

const SIDEBAR_ENTRY_LIST_LIMIT = 8;

const Guest = () => {
  const users = useSelector(s => s.users);
  const organizations = useSelector(s => s.organizations);
  const tags = useSelector(s => s.tags);
  const state = useSelector(s => s.mainPage);
  const posts = useSelector(s => s.posts);
  const dispatch = useDispatch();

  const getPageData = async (tabId) => {
    try {
      await withLoader(dispatch(mainPageActions.getPageData(tabId)));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotification(err.message));
    }
  };

  const getFeed = async (page, tabId) => {
    try {
      await withLoader(dispatch(mainPageActions.getFeed(tabId, page)));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotification(err.message));
    }
  };

  const getUsersForPopup = async (page) => {
    try {
      await withLoader(dispatch(mainPageActions.getUsersForPopup(page)));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotification(err.message));
    }
  };

  const getOrganizationsForPopup = async (page, activeTabId) => {
    try {
      await withLoader(dispatch(mainPageActions.getOrganizationsForPopup(page, activeTabId)));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotification(err.message));
    }
  };

  const getTagsForPopup = async (page) => {
    try {
      await withLoader(dispatch(mainPageActions.getTagsForPopup(page)));
    } catch (err) {
      console.error(err);
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
      onChangePage={page => getOrganizationsForPopup(page, state.activeTabId)}
    />
  );

  const onClickLoadMore = () => {
    getFeed(state.feed.page + 1, state.activeTabId);
  };

  useEffect(() => {
    getPageData(state.activeTabId);
  }, [state.activeTabId]);

  return (
    <Fragment>
      <PostsGrid posts={getPostByIds(posts, state.topPostsIds)} />

      <div className="content">
        <div className="content__inner">
          <div className="grid grid_content">
            <div className="grid__item grid__item_main">
              <Tabs
                activeTabId={state.activeTabId}
                onClickItem={(activeTabId) => {
                  dispatch(mainPageActions.changeTab(activeTabId));
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

export default Guest;
