import { graphql } from '../../../api';
import { addUsers } from '../../users';

export const reset = () => ({ type: 'USERS_PAGE_RESET' });

export const setData = payload => ({ type: 'USERS_PAGE_SET_DATA', payload });

export const getUsers = (page, perPage, orderBy, userName, append) => async (dispatch, getState) => {
  const state = getState();
  const { ids } = state.pages.users;

  try {
    const { data, metadata } = await graphql.getUsers({
      page: Number(page),
      perPage: Number(perPage),
      orderBy,
      ...(userName ? {
        filters: {
          usersIdentityPattern: userName,
        },
      } : {}),
    });

    dispatch(addUsers(data));

    dispatch(setData({
      ids: [...(append ? ids : []), ...data.map(i => i.id)],
      metadata,
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
