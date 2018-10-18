import { uniqueId } from 'lodash';

const getInitialState = () => ({
  list: {},
  tooltipVisibilty: false,
  totalUnreadAmount: 0,
});

const siteNotifications = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'RESET_NOTIFICATIONS_TOOLTIP': {
      return getInitialState();
    }

    case 'HIDE_NOTIFICATIONS_TOOLTIP': {
      return {
        ...state, tooltipVisibilty: false,
      };
    }
    case 'SET_UNREAD_NOTIFICATIONS_AMOUNT': {
      return {
        ...state, totalUnreadAmount: action.payload,
      };
    }
    case 'SHOW_NOTIFICATIONS_TOOLTIP': {
      return {
        ...state, tooltipVisibilty: true,
      };
    }

    case 'ADD_SITE_NOTIFICATIONS': {
      return {
        ...state,
        list: {
          ...state.list,
          ...action.payload.data.reduce((accumulator, currentValue) => {
            const id = currentValue.id || uniqueId((new Date()).getTime());
            return { ...accumulator, [id]: { ...currentValue, id } };
          }, {}),
        },
      };
    }

    case 'DELETE_SITE_NOTIFICATION': {
      const list = { ...state.list };
      delete list[action.payload.id];

      return {
        ...state,
        list,
      };
    }

    default: {
      return state;
    }
  }
};

export default siteNotifications;
