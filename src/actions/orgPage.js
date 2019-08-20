import graphql from '../api/graphql';
import { addUsers } from './users';
import { LIST_ORDER_BY_RATE, LIST_PER_PAGE } from '../utils/constants';

export const reset = () => ({ type: 'ORG_PAGE_RESET' });

export const setData = payload => ({ type: 'ORG_PAGE_SET_DATA', payload });

export const getPageData = orgIdentity => async (dispatch) => {
  try {
    const followedBy = await graphql.getOrganizationActivity({
      filters: {
        organization_identity: `${orgIdentity}`,
        activity: 'followed_by',
      },
      order_by: LIST_ORDER_BY_RATE,
      per_page: LIST_PER_PAGE,
      page: 1,
    });

    dispatch(addUsers(followedBy.data));

    dispatch(setData({
      loaded: true,
      followedBy: {
        ids: followedBy.data.map(i => i.id),
        metadata: followedBy.metadata,
      },
      followedByPopup: {
        ids: followedBy.data.map(i => i.id),
        metadata: followedBy.metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    dispatch(setData({ loaded: true }));
    throw err;
  }
};

export const getFollowedByPopup = (orgIdentity, page) => async (dispatch) => {
  const { data, metadata } = await graphql.getOrganizationActivity({
    filters: {
      organization_identity: `${orgIdentity}`,
      activity: 'followed_by',
    },
    order_by: LIST_ORDER_BY_RATE,
    per_page: LIST_PER_PAGE,
    page,
  });

  dispatch(addUsers(data));

  dispatch(setData({
    followedByPopup: {
      ids: data.map(i => i.id),
      metadata,
    },
    followedBy: {
      metadata,
    },
  }));
};
