import socket from '../api/socket';
import api from '../api';
import loader from '../utils/loader';
import { addErrorNotification } from './notifications';
import { getOrganization } from './organizations';
import { PER_PAGE, INITTIAL_PAGE } from '../utils/notifications';
import { blockPageContent, unblockPageContent } from '../utils/page';
import { isMobile } from '../utils/mediaQueries';

export const showNotificationTooltip = () => {
  if (isMobile()) {
    blockPageContent();
  }

  return ({ type: 'SHOW_NOTIFICATIONS_TOOLTIP' });
};

export const hideNotificationTooltip = () => {
  if (isMobile()) {
    unblockPageContent();
  }

  return ({ type: 'HIDE_NOTIFICATIONS_TOOLTIP' });
};

export const resetNotificationTooltip = () => ({ type: 'RESET_NOTIFICATIONS_TOOLTIP' });
export const resetNotificationTooltipData = () => ({ type: 'RESET_NOTIFICATIONS_TOOLTIP_DATA' });
export const requestNotificationTooltipData = () => ({ type: 'REQUEST_NOTIFICATIONS_TOOLTIP_DATA' });
export const addSiteNotifications = payload => ({ type: 'ADD_SITE_NOTIFICATIONS', payload });
export const deleteSiteNotification = payload => ({ type: 'DELETE_SITE_NOTIFICATION', payload });
export const setUnreadNotificationsAmount = payload => ({ type: 'SET_UNREAD_NOTIFICATIONS_AMOUNT', payload });

export const fetchNotifications = (payload = {}) => async (dispatch) => {
  payload = {
    perPage: payload.perPage || PER_PAGE,
    page: payload.page || INITTIAL_PAGE,
  };
  loader.start();
  dispatch(requestNotificationTooltipData());
  try {
    const res = await api.getNotifications(payload.perPage, payload.page);
    dispatch(addSiteNotifications({ data: res.data, metadata: res.metadata }));
  } catch (error) {
    dispatch(addErrorNotification(error));
  }
  loader.done();
};

export const showAndFetchNotifications = () => (dispatch) => {
  dispatch(showNotificationTooltip());
  dispatch(fetchNotifications());
};

export const confirmNotification = ({ id, idOfOrg }) => async (dispatch) => {
  loader.start();
  try {
    const res = await api.confirmNotification(id);
    dispatch(addSiteNotifications({ data: [res] }));
    dispatch(setUnreadNotificationsAmount(res.myselfData.unreadMessagesCount));
    dispatch(getOrganization(idOfOrg));
  } catch (error) {
    dispatch(addErrorNotification(error));
  }
  loader.done();
};

export const declineNotification = id => async (dispatch) => {
  loader.start();
  try {
    const res = await api.declineNotification(id);
    dispatch(addSiteNotifications({ data: [res] }));
    dispatch(setUnreadNotificationsAmount(res.myselfData.unreadMessagesCount));
  } catch (error) {
    dispatch(addErrorNotification(error));
  }
  loader.done();
};

export const seenNotification = id => async (dispatch) => {
  try {
    const res = await api.seenNotification(id);
    dispatch(addSiteNotifications({ data: [res] }));
    dispatch(setUnreadNotificationsAmount(res.myselfData.unreadMessagesCount));
  } catch (error) {
    dispatch(addErrorNotification(error));
  }
};

export const initNotificationsListeners = () => (dispatch) => {
  socket.on('notification', (res) => {
    if (res.unread_messages_count) {
      dispatch(setUnreadNotificationsAmount(res.unread_messages_count));
      dispatch(fetchNotifications());
    }
  });
};
