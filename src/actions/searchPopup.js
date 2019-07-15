import graphql from '../api/graphql';
import * as usersActions from './users';

export const reset = () => ({ type: 'SEARCH_POPUP_RESET' });

export const setData = payload => ({ type: 'SEARCH_POPUP_SET_DATA', payload });

export const show = () => (dispatch) => {
  dispatch(setData({ visible: true }));
};

export const hide = () => (dispatch) => {
  dispatch(reset());
};

export const search = query => async (dispatch) => {
  if (!query) {
    dispatch(setData({
      result: {
        users: {
          ids: [],
          hasMore: false,
        },
      },
    }));
    return;
  }

  dispatch(setData({
    loading: true,
  }));

  try {
    const { data, metadata } = await graphql.getUsers({
      page: 1,
      perPage: 7,
      orderBy: '-current_rate',
      filters: {
        usersIdentityPattern: query,
      },
    });

    dispatch(usersActions.addUsers(data));

    dispatch(setData({
      loading: false,
      result: {
        users: {
          ids: data.map(i => i.id),
          hasMore: metadata.hasMore,
        },
      },
    }));
  } catch (err) {
    dispatch(setData({
      loading: false,
    }));
    throw err;
  }
};
