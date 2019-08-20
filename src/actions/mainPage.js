import graphql from '../api/graphql';
import { addPostsAndComments } from './feed';
import { addOrganizations } from './organizations';
import { addTags } from './tags';
import { addUsers } from './users';
import { TAB_ID_PEOPLE, TAB_ID_COMMUNITIES } from '../components/Feed/Tabs';
import {
  LIST_PER_PAGE,
  LIST_ORDER_BY_RATE,
  LIST_ORDER_BY_ID,
  ENTITY_NAMES_USERS,
  ENTITY_NAMES_ORG,
  POST_TYPE_MEDIA_ID,
  POST_TYPE_DIRECT_ID,
} from '../utils/constants';

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
        posts: {
          filters: {
            post_type_ids: [POST_TYPE_MEDIA_ID],
            entity_names_from: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
            entity_names_for: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
          },
          order_by: LIST_ORDER_BY_RATE,
          per_page: LIST_PER_PAGE,
          page: 1,
        },
        feed: {
          params: {
            filters: {
              post_type_ids: [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID],
              entity_names_from: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
              entity_names_for: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
            },
            order_by: LIST_ORDER_BY_ID,
            per_page: LIST_PER_PAGE,
            page: 1,
          },
          include: {
            comments: {
              page: 1,
              per_page: 3,
            },
          },
        },
        users: {
          filters: {
            overview_type: 'trending',
          },
          order_by: '-scaled_social_rate_delta',
          per_page: LIST_PER_PAGE,
          page: 1,
        },
      }),
      activeTabId === TAB_ID_PEOPLE ? graphql.getHotOrganizations() : graphql.getTrendingOrganizations(),
      graphql.getTrendingTags(),
    ]);

    const [{
      feed, users, posts,
    }, { manyOrganizations }, { manyTags }] = result;

    dispatch(addPostsAndComments(feed.data.concat(posts.data)));
    dispatch(addUsers(users.data));
    dispatch(addOrganizations(manyOrganizations.data));
    dispatch(addTags(manyTags.data));
    dispatch(setData({
      feed: {
        page: 1,
        hasMore: feed.metadata.hasMore,
        postsIds: feed.data.map(i => i.id),
        userIds: users.data.map(i => i.id),
        organizationsIds: manyOrganizations.data.map(i => i.id),
        tagsIds: manyTags.data.map(i => i.title),
      },
      usersPopup: {
        ids: users.data.map(i => i.id),
        metadata: users.metadata,
      },
      organizationsPopup: {
        ids: manyOrganizations.data.map(i => i.id),
        metadata: manyOrganizations.metadata,
      },
      tagsPopup: {
        ids: manyTags.data.map(i => i.title),
        metadata: manyTags.metadata,
      },
      topPostsIds: posts.data.map(post => post.id),
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
      params: {
        filters: {
          post_type_ids: [POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID],
          entity_names_from: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
          entity_names_for: activeTabId === TAB_ID_PEOPLE ? [ENTITY_NAMES_USERS] : [ENTITY_NAMES_ORG],
        },
        order_by: LIST_ORDER_BY_ID,
        per_page: LIST_PER_PAGE,
        page,
      },
      include: {
        comments: {
          page: 1,
          per_page: 3,
        },
      },
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
  const data = await graphql.getManyUsers({ page });

  dispatch(addUsers(data.data));
  dispatch(setData({
    usersPopup: {
      ids: data.data.map(user => user.id),
      metadata: data.metadata,
    },
  }));
};

export const getOrganizationsForPopup = (page, activeTabId = TAB_ID_COMMUNITIES) => async (dispatch) => {
  const data = await (activeTabId === TAB_ID_PEOPLE ?
    graphql.getHotOrganizations({ page }) :
    graphql.getTrendingOrganizations({ page }));

  dispatch(setData({
    organizationsPopup: {
      ids: data.manyOrganizations.data.map(org => org.id),
      metadata: data.manyOrganizations.metadata,
    },
  }));
  dispatch(addOrganizations(data.manyOrganizations.data));
};

export const getTagsForPopup = page => async (dispatch) => {
  const data = await graphql.getTrendingTags({ page });
  dispatch(setData({
    tagsPopup: {
      ids: data.manyTags.data.map(tag => tag.title),
      metadata: data.manyTags.metadata,
    },
  }));
  dispatch(addTags(data.manyTags.data));
};
