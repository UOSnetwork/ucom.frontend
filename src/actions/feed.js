import * as overviewUtils from '../utils/overview';
import { addUsers } from './users';
import { addOrganizations } from './organizations';

import {
  USER_NEWS_FEED_ID,
  USER_WALL_FEED_ID,
  ORGANIZATION_FEED_ID,
  TAG_FEED_ID,
} from '../utils/feed';
import { COMMENTS_INITIAL_COUNT_USER_WALL_FEED, COMMENTS_CONTAINER_ID_FEED_POST } from '../utils/comments';
import api from '../api';
import graphql from '../api/graphql';
import { addPosts } from './posts';
import { commentsAddContainerData } from './comments';

export const feedReset = () => ({ type: 'POSTS_FEED_RESET' });
export const feedSetLoading = payload => ({ type: 'POSTS_FEED_SET_LOADING', payload });
export const feedSetMetadata = payload => ({ type: 'POSTS_FEED_SET_METADATA', payload });
export const feedSetPostIds = payload => ({ type: 'POSTS_FEED_SET_POST_IDS', payload });
export const feedPrependPostIds = payload => ({ type: 'POSTS_FEED_PREPEND_POST_IDS', payload });
export const feedAppendPostIds = payload => ({ type: 'POSTS_FEED_APPEND_POST_IDS', payload });
export const feedSetSideUsers = payload => ({ type: 'POSTS_FEED_SET_SIDE_USERS', payload });
export const feedSetSideOrganizations = payload => ({ type: 'POSTS_FEED_SET_SIDE_ORGANIZATIONS', payload });
export const feedSetSideTags = payload => ({ type: 'POSTS_FEED_SET_SIDE_TAGS', payload });


export const parseFeedData = ({
  posts,
  metadata,
}) => (dispatch) => {
  posts.forEach((post) => {
    if (post.comments) {
      dispatch(commentsAddContainerData({
        containerId: COMMENTS_CONTAINER_ID_FEED_POST,
        entryId: post.id,
        parentId: 0,
        comments: post.comments.data,
        metadata: post.comments.metadata,
      }));

      delete post.comments;
    }
  });

  dispatch(addPosts(posts));
  dispatch(feedAppendPostIds(posts.map(i => i.id)));
  dispatch(feedSetMetadata(metadata));
};

export const feedGetUserPosts = ({
  page,
  perPage,
  feedTypeId,
  userId,
  organizationId,
  tagIdentity,
  userIdentity,
}) => async (dispatch) => {
  const getFeedFunctions = {
    [USER_NEWS_FEED_ID]: graphql.getUserNewsFeed,
    [USER_WALL_FEED_ID]: graphql.getUserWallFeed,
    [ORGANIZATION_FEED_ID]: graphql.getOrganizationWallFeed,
    [TAG_FEED_ID]: graphql.getTagWallFeed,
  };

  dispatch(feedSetLoading(true));

  try {
    const data = await getFeedFunctions[feedTypeId]({
      page,
      perPage,
      userId,
      organizationId,
      tagIdentity,
      userIdentity,
      commentsPerPage: COMMENTS_INITIAL_COUNT_USER_WALL_FEED,
    });
    dispatch(parseFeedData({
      posts: data.data,
      metadata: data.metadata,
    }));
  } catch (e) {
    console.error(e);
  }

  dispatch(feedSetLoading(false));
};

export const feedCreatePost = (feedTypeId, params) => (dispatch) => {
  const createCommentPostFunctions = {
    [USER_NEWS_FEED_ID]: api.createUserCommentPost.bind(api),
    [USER_WALL_FEED_ID]: api.createUserCommentPost.bind(api),
    [ORGANIZATION_FEED_ID]: api.createOrganizationsCommentPost.bind(api),
    [TAG_FEED_ID]: api.createUserCommentPost.bind(api),
  };

  dispatch(feedSetLoading(true));

  return createCommentPostFunctions[feedTypeId](params)
    .then((data) => {
      dispatch(addPosts([data]));
      dispatch(feedPrependPostIds([data.id]));
      dispatch(feedSetLoading(false));
    })
    .catch(() => {
      dispatch(feedSetLoading(false));
    });
};

const filter = {
  [overviewUtils.OVERVIEW_CATEGORIES_HOT_ID]: 'Hot',
  [overviewUtils.OVERVIEW_CATEGORIES_TRENDING_ID]: 'Trending',
  [overviewUtils.OVERVIEW_CATEGORIES_FRESH_ID]: 'Fresh',
  [overviewUtils.OVERVIEW_CATEGORIES_TOP_ID]: 'Top',
};

export const feedGetPosts = ({
  postTypeId,
  page,
  perPage,
  categoryId,
}) => async (dispatch) => {
  const params = {
    tab: 'Posts',
    filter: filter[categoryId],
    postTypeId,
    page,
    perPage,
    commentsPerPage: COMMENTS_INITIAL_COUNT_USER_WALL_FEED,
    commentsPage: page,
  };
  dispatch(feedSetLoading(true));

  try {
    const data = await graphql.getOverview(params);

    dispatch(parseFeedData({
      posts: data.manyPosts.data,
      metadata: data.manyPosts.metadata,
    }));
    dispatch(feedSetSideUsers(data.manyUsers.data));
    dispatch(addUsers(data.manyUsers.data));
    dispatch(feedSetSideOrganizations(data.manyOrganizations.data));
    dispatch(addOrganizations(data.manyOrganizations.data));
    dispatch(feedSetSideTags(data.manyTags.data));
  } catch (e) {
    console.error(e);
  }

  dispatch(feedSetLoading(false));
};
export const feedGetSide = ({
  categoryId,
  tab,
  side,
  postTypeId,
}) => async (dispatch) => {
  const params = {
    tab,
    filter: filter[categoryId],
    side,
    postTypeId,
  };
  dispatch(feedSetLoading(true));
  try {
    const data = await graphql.getOverviewSide(params);
    const payload = data[`many${side}`].data;
    dispatch({ type: `${tab.toUpperCase()}_FEED_SET_SIDE_${side.toUpperCase()}`, payload });
    if (side === 'Organizations') {
      dispatch(addOrganizations(payload));
    } else if (side === 'Users') {
      dispatch(addUsers(payload));
    }
  } catch (e) {
    console.error(e);
  }

  dispatch(feedSetLoading(false));
};
