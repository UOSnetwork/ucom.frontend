import graphql from '../api/graphql';
import * as usersActions from './users';
import * as tagsActions from './tags';
import * as orgsActions from './organizations';

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
    const defaultData = {
      ids: [],
      hasMore: false,
    };

    dispatch(setData({
      result: {
        users: defaultData,
        orgs: defaultData,
        tags: defaultData,
      },
    }));
    return;
  }

  dispatch(setData({ loading: true }));

  try {
    const { users, orgs, tags } = await graphql.searchEntities(query);

    dispatch(usersActions.addUsers(users.data));
    dispatch(orgsActions.addOrganizations(orgs.data));
    dispatch(tagsActions.addTags(tags.data));

    dispatch(setData({
      loading: false,
      result: {
        users: {
          ids: users.data.map(i => i.id),
          hasMore: users.metadata.hasMore,
        },
        orgs: {
          ids: orgs.data.map(i => i.id),
          hasMore: orgs.metadata.hasMore,
        },
        tags: {
          titles: tags.data.map(i => i.title),
          hasMore: tags.metadata.hasMore,
        },
      },
    }));
  } catch (err) {
    dispatch(setData({ loading: false }));
    throw err;
  }
};
