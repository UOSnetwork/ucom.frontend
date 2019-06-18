import { authShowPopup } from './auth';
import { parseErrors } from '../utils/errors';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
} from '../store/notifications';
import { ERROR_SERVER } from '../utils/constants';

export const addNotification = payload => ({ type: 'ADD_NOTIFICATION', payload });
export const closeNotification = payload => ({ type: 'CLOSE_NOTIFICATION', payload });

export const addErrorNotification = (message = ERROR_SERVER) => (dispatch) => {
  dispatch(addNotification({
    message,
    title: 'Error',
    type: NOTIFICATION_TYPE_ERROR,
  }));
};

export const addSuccessNotification = message => (dispatch) => {
  dispatch(addNotification({
    type: NOTIFICATION_TYPE_SUCCESS,
    title: 'Success',
    message,
  }));
};

export const addValidationErrorNotification = () => (dispatch) => {
  dispatch(addNotification({
    type: NOTIFICATION_TYPE_ERROR,
    title: 'Error',
    message: 'Some fields in the form are incorrect',
  }));
};

export const addServerErrorNotification = error => (dispatch) => {
  if ((error && error.response && error.response.status) === 401 || (error && error.status) === 401) {
    dispatch(authShowPopup());
  } else {
    dispatch(addNotification({ type: NOTIFICATION_TYPE_ERROR, message: parseErrors(error).general }));
  }
};

export const addMaintenanceNotification = () => (dispatch) => {
  dispatch(addNotification({
    type: NOTIFICATION_TYPE_ERROR,
    autoClose: false,
    title: 'Warning',
    message: 'The platform is on maintenance and in a read-only mode. Please avoid posting content, it will not be published.',
  }));
};
