import { actions as baseActions } from '../../../store/pages/ambassador';
import api, { graphql } from '../../../api';
import { fetchUser } from '../../users';

export default class Actions {
  static fetchUsers() {
    return async (dispatch) => {
      const fetchUsersWithAvatars = async (page = 1, users = []) => {
        const results = await Promise.all([
          graphql.getUsers({ page, perPage: 50, orderBy: '-current_rate' }),
          graphql.getUsers({ page: page + 1, perPage: 50, orderBy: '-current_rate' }),
          graphql.getUsers({ page: page + 2, perPage: 50, orderBy: '-current_rate' }),
        ]);

        results.forEach((result) => {
          users = users.concat(result.data.filter(i => i.avatarFilename));
        });

        if (users.length < 30) {
          users = await fetchUsersWithAvatars(page + results.length, users);
        }

        return users;
      };

      const users = await fetchUsersWithAvatars();

      dispatch(baseActions.merge({ users }));

      return users;
    };
  }

  static getJoined() {
    return async (dispatch) => {
      const stats = await api.getStats();

      const obj = Object.values(stats).find(i => i.description === 'USERS_PERSON__NUMBER');

      if (obj) {
        dispatch(baseActions.merge({ joined: obj.value }));
      }
    };
  }

  static fetchPageData(userIdentity) {
    return async (dispatch) => {
      const result = await Promise.all([
        dispatch(fetchUser(userIdentity)),
        dispatch(Actions.fetchUsers()),
        dispatch(Actions.getJoined()),
      ]);

      return result;
    };
  }
}
