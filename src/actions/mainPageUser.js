import graphql from '../api/graphql';
import { ENTITY_NAMES_USERS, ENTITY_NAMES_ORG, POST_TYPE_MEDIA_ID } from '../utils/posts';
import { addPosts } from './posts';
import { addOrganizations } from './organizations';

export const setData = payload => ({ type: 'MAIN_PAGE_USER_SET_DATA', payload });

export const getPageData = userIdentity => async (dispatch) => {
  try {
    const {
      oneUserFollowsOrganizations,
      postsFeed,
    } = await graphql.getUserMainPageData({
      topPostsParams: {
        postTypeIds: [POST_TYPE_MEDIA_ID],
        entityNamesFrom: [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
        entityNamesFor: [ENTITY_NAMES_USERS],
        orderBy: '-current_rate',
        page: 1,
        perPage: 10,
      },
      followsOrganizationsParams: {
        userIdentity,
        orderBy: '-current_rate',
        page: 1,
        perPage: 10,
      },
    });

    dispatch(addPosts(postsFeed.data));
    dispatch(addOrganizations(oneUserFollowsOrganizations.data));
    dispatch(setData({
      orgs: {
        ids: oneUserFollowsOrganizations.data.map(org => org.id),
        metadata: oneUserFollowsOrganizations.metadata,
      },
      orgsPopup: {
        ids: oneUserFollowsOrganizations.data.map(org => org.id),
        metadata: oneUserFollowsOrganizations.metadata,
      },
      topPostsIds: postsFeed.data.map(post => post.id),
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getOrganizations = (userIdentity, page) => async (dispatch) => {
  try {
    const result = await graphql.getUserFollowsOrganizations({
      userIdentity,
      page,
      perPage: 10,
      orderBy: '-current_rate',
    });

    dispatch(addOrganizations(result.data));
    dispatch(setData({
      orgsPopup: {
        ids: result.data.map(i => i.id),
        metadata: result.metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
