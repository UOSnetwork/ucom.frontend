import { camelCase, isArray, isObject, isString } from 'lodash';
import { ERROR_SERVER } from './constants';

// TODO: Make one functions for parse all errors

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

export const parseResponseError = (error) => {
  if (error.response && error.response.data && isArray(error.response.data.errors)) {
    return error.response.data.errors;
  }

  if (error.response && error.response.data && isObject(error.response.data.errors)) {
    return Object.keys(error.response.data.errors)
      .map(key => ({
        field: key,
        message: error.response.data.errors[key],
      }));
  }

  if (error.response && error.response.data && isString(error.response.data.errors)) {
    return [{
      field: 'general',
      message: error.response.data.errors,
    }];
  }

  try {
    const { message } = error;
    const data = JSON.parse(message);
    return data.errors || data.details;
  } catch (e) {
    return [{
      message: error.message || ERROR_SERVER,
      field: 'general',
    }];
  }
};
