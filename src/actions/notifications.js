import { authShowPopup } from './auth';
import { parseErrors, parseResponseError } from '../utils/errors';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
} from '../store/notifications';
import {
  ERROR_SERVER,
  NOTIFICATION_TITLE_ERROR,
  NOTIFICATION_TITLE_SUCCESS,
  NOTIFICATION_ERROR_FORM_VALIDATION,
  NOTIFICATION_ERROR_MAINTANCE_MODE,
  NOTIFICATION_TITLE_WARNING,
} from '../utils/constants';

export const addNotification = payload => ({ type: 'ADD_NOTIFICATION', payload });

export const closeNotification = payload => ({ type: 'CLOSE_NOTIFICATION', payload });

export const addErrorNotification = (message = ERROR_SERVER) => (dispatch) => {
  dispatch(addNotification({
    message,
    title: NOTIFICATION_TITLE_ERROR,
    type: NOTIFICATION_TYPE_ERROR,
  }));
};

export const addErrorNotificationFromResponse = payload => (dispatch) => {
  const { message } = parseResponseError(payload)[0];

  console.log(message);

  dispatch(addErrorNotification(message));
};

export const addServerErrorNotification = error => (dispatch) => {
  if ((error && error.response && error.response.status) === 401 || (error && error.status) === 401) {
    dispatch(authShowPopup());
  } else {
    dispatch(addNotification({ type: NOTIFICATION_TYPE_ERROR, message: parseErrors(error).general }));
  }
};

export const addValidationErrorNotification = () => (dispatch) => {
  dispatch(addNotification({
    type: NOTIFICATION_TYPE_ERROR,
    title: NOTIFICATION_TITLE_ERROR,
    message: NOTIFICATION_ERROR_FORM_VALIDATION,
  }));
};

export const addSuccessNotification = message => (dispatch) => {
  dispatch(addNotification({
    type: NOTIFICATION_TYPE_SUCCESS,
    title: NOTIFICATION_TITLE_SUCCESS,
    message,
  }));
};

export const addMaintenanceNotification = () => (dispatch) => {
  dispatch(addNotification({
    type: NOTIFICATION_TYPE_ERROR,
    autoClose: false,
    title: NOTIFICATION_TITLE_WARNING,
    message: NOTIFICATION_ERROR_MAINTANCE_MODE,
  }));
};
