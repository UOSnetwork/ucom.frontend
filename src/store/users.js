import { USER_ACCOUNT_LENGTH } from '../utils/constants';

const getInitialState = () => ({
  data: {},
});

const users = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'USERS_RESET':
      return getInitialState();

    case 'USERS_ADD': {
      const users = action.payload.filter(i => i.id);

      if (!users.length) {
        return state;
      }

      return {
        ...state,
        data: {
          ...state.data,
          ...users.reduce((result, user) => ({
            ...result,
            [user.id]: {
              ...state.data[user.id],
              ...result[user.id],
              ...user,
            },
          }), {}),
        },
      };
    }

    case 'USERS_SET_TRUST':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.userId]: {
            ...state.data[action.payload.userId],
            myselfData: {
              ...(state.data[action.payload.userId] ? state.data[action.payload.userId].myselfData : null),
              trust: action.payload.trust,
            },
          },
        },
      };

    default:
      return state;
  }
};

export const getUserById = (users, userIdOrName) => {
  let result;

  if (Number.isNaN(+userIdOrName) || `${userIdOrName}`.length === USER_ACCOUNT_LENGTH) {
    result = Object.values(users.data).find(e => e.accountName === userIdOrName);
  }

  return result || users.data[userIdOrName];
};

export const getUsersByIds = (users, ids = [], limit) => {
  let result = ids.map(id => getUserById(users, id))
    .filter(user => Boolean(user));

  if (limit) {
    result = result.slice(0, limit);
  }

  return result;
};

export default users;
