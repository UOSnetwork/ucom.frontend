import { camelCase, isArray } from 'lodash';
import { ERROR_SERVER } from './constants';

export const parseErrors = (error) => {
  if (error.response && error.response.data && error.response.data.errors) {
    return Array.isArray(error.response.data.errors) ?
      error.response.data.errors.map(item => ({ ...item, field: camelCase(item.field) })) :
      error.response.data.errors;
  }

  const errors = {
    general: error.message,
  };

  return errors;
};

// TODO: Make one functions for all server errors and remove parseErrors
export const parseResponseError = (error) => {
  if (error.response && error.response.data && isArray(error.response.data.errors)) {
    return error.response.data.errors;
  }

  try {
    const { message } = error;
    const data = JSON.parse(message);
    return data.errors;
  } catch (e) {
    return [{
      message: ERROR_SERVER,
      field: 'general',
    }];
  }
};
