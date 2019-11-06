import { uniqueId } from 'lodash';

export const NOTIFICATION_TYPE_ERROR = 1;
export const NOTIFICATION_TYPE_SUCCESS = 2;
export const NOTIFICATION_TYPE_BLOCKCHAIN_PERMISSIONS_ERROR = 3;

const getInitialState = () => ({
  list: [],
});

const notifications = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'RESET_NOTIFICATIONS': {
      return getInitialState();
    }

    case 'ADD_NOTIFICATION': {
      return Object.assign({}, state, {
        list: state.list.concat(Object.assign({}, {
          id: uniqueId((new Date()).getTime()),
        }, action.payload)),
      });
    }

    case 'CLOSE_NOTIFICATION': {
      return Object.assign({}, state, {
        list: state.list.map(item => Object.assign({}, item, {
          closed: item.id === action.payload ? true : item.closed,
        })),
      });
    }

    default: {
      return state;
    }
  }
};

export default notifications;
