import graphql from '../api/graphql';
import { addPostsAndComments } from './feed';
import { addOrganizations } from './organizations';
import { addTags } from './tags';
import { addUsers } from './users';
import { TAB_ID_PEOPLE, TAB_ID_COMMUNITIES } from '../components/Feed/Tabs';
import { ENTITY_NAMES_USERS, ENTITY_NAMES_ORG, POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID } from '../utils/posts';

export const reset = () => ({ type: 'MAIN_PAGE_RESET' });
export const setData = payload => ({ type: 'MAIN_PAGE_SET_DATA', payload });

export const changeTab = activeTabId => (dispatch) => {
  dispatch(setData({
    activeTabId,
  }));
};

export const getPageData = (activeTabId = TAB_ID_COMMUNITIES) => async (dispatch) => {
  dispatch(setData({
    feed: { loading: true },
  }));

  try {
    const result = await Promise.all([
      graphql.getMainPageData({
        postsFeedParams: {
          page: 1,
          postTypeIds: [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID],
          entityNamesFrom: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
          entityNamesFor: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
          orderBy: '-id',
          commentsPage: 1,
          commentsPerPage: 3,
        },
      }),
      graphql.getPostsFeed({
        postTypeIds: [POST_TYPE_MEDIA_ID],
        entityNamesFrom: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
        entityNamesFor: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
        orderBy: '-current_rate',
      }),
    ]);

    const [{
      postsFeed, manyUsers, manyOrganizations, manyTags,
    }, mainPosts] = result;

    dispatch(addPostsAndComments(postsFeed.data.concat(mainPosts.data)));
    dispatch(addUsers(manyUsers.data));
    dispatch(addOrganizations(manyOrganizations.data));
    dispatch(addTags(manyTags.data));
    dispatch(setData({
      feed: {
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
      topPostsIds: mainPosts.data.map(post => post.id),
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }

  dispatch(setData({
    feed: { loading: false },
  }));
};

export const getFeed = (activeTabId, page) => async (dispatch, getState) => {
  dispatch(setData({
    feed: { loading: true },
  }));

  try {
    const state = getState();
    const postsFeed = await graphql.getPostsFeed({
      page,
      postTypeIds: [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID],
      entityNamesFrom: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
      entityNamesFor: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
      orderBy: '-id',
      commentsPage: 1,
      commentsPerPage: 3,
    });

    dispatch(addPostsAndComments(postsFeed.data));
    dispatch(setData({
      feed: {
        page,
        hasMore: postsFeed.metadata.hasMore,
        postsIds: state.mainPage.feed.postsIds.concat(postsFeed.data.map(i => i.id)),
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }

  dispatch(setData({
    feed: { loading: false },
  }));
};

export const getUsersForPopup = page => async (dispatch) => {
  try {
    const data = await graphql.getManyUsers({ page });

    dispatch(addUsers(data.data));
    dispatch(setData({
      usersPopup: {
        ids: data.data.map(user => user.id),
        metadata: data.metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getOrganizationsForPopup = page => async (dispatch) => {
  try {
    const data = await graphql.getTrendingOrganizations({ page });
    dispatch(setData({
      organizationsPopup: {
        ids: data.manyOrganizations.data.map(org => org.id),
        metadata: data.manyOrganizations.metadata,
      },
    }));
    dispatch(addOrganizations(data.manyOrganizations.data));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getTagsForPopup = page => async (dispatch) => {
  try {
    const data = await graphql.getTrendingTags({ page });
    dispatch(setData({
      tagsPopup: {
        ids: data.manyTags.data.map(tag => tag.title),
        metadata: data.manyTags.metadata,
      },
    }));
    dispatch(addTags(data.manyTags.data));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
