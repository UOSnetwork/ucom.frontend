import { parseResponseError } from '../utils/errors';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_BLOCKCHAIN_PERMISSIONS_ERROR,
} from '../store/notifications';
import {
  ERROR_SERVER,
  NOTIFICATION_TITLE_ERROR,
  NOTIFICATION_TITLE_SUCCESS,
  NOTIFICATION_ERROR_FORM_VALIDATION,
  NOTIFICATION_ERROR_MAINTANCE_MODE,
  NOTIFICATION_TITLE_WARNING,
  BLOCKCHAIN_PERMISSIONS_ERROR,
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
  if (payload.message === BLOCKCHAIN_PERMISSIONS_ERROR) {
    dispatch(addNotification({
      title: NOTIFICATION_TITLE_ERROR,
      type: NOTIFICATION_TYPE_BLOCKCHAIN_PERMISSIONS_ERROR,
      autoClose: false,
    }));
  } else {
    const { message } = parseResponseError(payload)[0];

    dispatch(addErrorNotification(message));
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

export const addNonMultiSignError = () => (dispatch) => {
  dispatch(addNotification({
    message: 'In order to continue, the admin of the community needs to transform it into a multisig account',
    title: NOTIFICATION_TITLE_ERROR,
    type: NOTIFICATION_TYPE_ERROR,
  }));
};
