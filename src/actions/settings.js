import graphql from '../api/graphql';
import * as usersActions from './users';

export const reset = () => ({ type: 'SETTINGS_RESET' });

export const setData = payload => ({ type: 'SETTINGS_SET_DATA', payload });

export const getReferrals = (userId, page) => async (dispatch, getState) => {
  const { settings } = getState();

  try {
    const { users } = await graphql.getUserReferrals(userId, page, 10);
    const ids = users.data.map(i => i.id);

    dispatch(usersActions.addUsers(users.data));

    dispatch(setData({
      refferals: {
        ids: settings.refferals.ids.length ? settings.refferals.ids : ids,
        popupIds: ids,
        metadata: users.metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
