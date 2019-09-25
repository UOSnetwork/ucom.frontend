import * as overviewUtils from '../utils/overview';
import { addUsers } from './users';
import { addOrganizations } from './organizations';
import {
  FEED_TYPE_ID_USER_NEWS,
  FEED_TYPE_ID_USER_WALL,
  FEED_TYPE_ID_ORGANIZATION,
  FEED_TYPE_ID_TAG,
} from '../utils';
import { COMMENTS_INITIAL_COUNT_USER_WALL_FEED, COMMENTS_CONTAINER_ID_FEED_POST } from '../utils/comments';
import graphql from '../api/graphql';
import { addPosts, createDirectPost } from './posts';
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
export const feedSetExcludeFilterId = payload => ({ type: 'POSTS_FEED_SET_EXCLUDE_FILTER_ID', payload });

export const addPostsAndComments = (posts = []) => (dispatch) => {
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
};

export const parseFeedData = ({
  posts,
  metadata,
}) => (dispatch) => {
  dispatch(addPostsAndComments(posts));
  if (metadata.page > 1) {
    dispatch(feedAppendPostIds(posts.map(i => i.id)));
  } else {
    dispatch(feedSetPostIds(posts.map(i => i.id)));
  }
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
  excludePostTypeIds,
}) => async (dispatch) => {
  const getFeedFunctions = {
    [FEED_TYPE_ID_USER_NEWS]: graphql.getUserNewsFeed,
    [FEED_TYPE_ID_USER_WALL]: graphql.getUserWallFeed,
    [FEED_TYPE_ID_ORGANIZATION]: graphql.getOrganizationWallFeed,
    [FEED_TYPE_ID_TAG]: graphql.getTagWallFeed,
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
      excludePostTypeIds,
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

export const createPost = (
  ownerId,
  ownerAccountName,
  ownerPrivateKey,
  userId,
  userAccountName,
  orgId,
  orgBlockchainId,
  data,
) => async (dispatch) => {
  dispatch(feedSetLoading(true));

  try {
    const post = await dispatch(createDirectPost(
      ownerId,
      ownerAccountName,
      ownerPrivateKey,
      userId,
      userAccountName,
      orgId,
      orgBlockchainId,
      data,
    ));

    dispatch(feedPrependPostIds([post.id]));
    dispatch(feedSetLoading(false));

    return post;
  } catch (err) {
    dispatch(feedSetLoading(false));
    throw err;
  }
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
