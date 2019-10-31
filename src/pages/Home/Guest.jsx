import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, Fragment } from 'react';
import Tabs, { TAB_ID_COMMUNITIES } from '../../components/Feed/Tabs';
import FeedView from '../../components/Feed/FeedView';
import { FEED_TYPE_ID_MAIN } from '../../utils';
import { addErrorNotification } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';
import { EntryListSectionUsersWrapper, EntryListSectionOrgsWrapper, EntryListSectionTagsWrapper } from '../../components/EntryListSection';
import CommunityBanner from '../../components/CommunityBanner';
import { PostsGridWrapper } from '../../components/PostsGrid';
import * as mainPageActions from '../../actions/mainPage';
import LayoutBase from '../../components/Layout/LayoutBase';

const SIDEBAR_ENTRY_LIST_LIMIT = 8;

const Guest = () => {
  const { t } = useTranslation();
  const state = useSelector(s => s.mainPage);
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
    <EntryListSectionUsersWrapper
      title={state.activeTabId === TAB_ID_COMMUNITIES ? t('Recent Top Authors') : t('Top Users of the Day')}
      limit={SIDEBAR_ENTRY_LIST_LIMIT}
      ids={state.feed.userIds}
      popupIds={state.usersPopup.ids}
      popupMetadata={state.usersPopup.metadata}
      onChangePage={getUsersForPopup}
    />
  );

  const communitiesSections = (
    <EntryListSectionOrgsWrapper
      title={state.activeTabId === TAB_ID_COMMUNITIES ? t('Top Communities This Week') : t('MostBuzzinCommunities')}
      limit={SIDEBAR_ENTRY_LIST_LIMIT}
      ids={state.feed.organizationsIds}
      popupIds={state.organizationsPopup.ids}
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
    <LayoutBase>
      <PostsGridWrapper ids={state.topPostsIds} />

      <div className="content" style={{ overflow: 'hidden' }}>
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
      </div>
      <div className="content" style={{ paddingTop: 0 }}>
        <div className="content__inner">
          <div className="grid grid_content">
            <div className="grid__item grid__item_main">
              <FeedView
                feedTypeId={FEED_TYPE_ID_MAIN}
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

              <EntryListSectionTagsWrapper
                title={t('Popular Today')}
                limit={SIDEBAR_ENTRY_LIST_LIMIT}
                titles={state.feed.tagsIds}
                popupTitles={state.tagsPopup.ids}
                popupMetadata={state.tagsPopup.metadata}
                onChangePage={getTagsForPopup}
              />
            </div>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default Guest;
