import { isObject, isArray } from 'lodash';
import { validUrl } from './url';
import {
  VALIDATION_INPUT_MAX_LENGTH,
  VALIDATION_TEXTAREA_MAX_LENGTH,
  VALIDATION_INPUT_MAX_LENGTH_ERROR,
  VALIDATION_TEXTAREA_MAX_LENGTH_ERROR,
  VALIDATION_REQUIRED_ERROR,
  VALIDATION_URL_ERROR,
  REGEX_EMAIL,
  VALIDATION_EMAIL_ERROR,
} from './constants';

export default class Validate {
  static validate(data, rules) {
    const fields = Object.keys(data);
    const errors = {};

    fields.forEach((field) => {
      const rule = rules[field];

      if (!rule) {
        return;
      }

      if (Array.isArray(rule) && typeof rule[0] === 'function') {
        const err = rule.map(r => r(data[field])).filter(i => Boolean(i));
        errors[field] = err.length ? err[0] : null;
      } else if (Array.isArray(rule) && Array.isArray(rule[0])) {
        errors[field] = data[field].map((value) => {
          const err = rule[0].map(r => r(value).filter(i => Boolean(i)));
          return err.length ? err[0] : null;
        });
      } else if (Array.isArray(rule) && typeof rule[0] === 'object') {
        errors[field] = data[field].map((obj) => {
          const keys = Object.keys(rule[0]);
          const errors = {};
          keys.forEach((key) => {
            const err = rule[0][key].map(r => r(obj[key])).filter(i => Boolean(i));
            errors[key] = err.length ? err[0] : null;
          });
          return errors;
        });
      }
    });

    return {
      errors,
      isValid: Validate.isValid(errors),
    };
  }

  static isValid(errors) {
    const fields = Object.values(errors);

    for (let i = 0; i < fields.length; i++) {
      if (Array.isArray(fields[i]) && typeof fields[i][0] === 'object') {
        for (let j = 0; j < fields[i].length; j++) {
          if ((Object.values(fields[i][j])).filter(d => !!d).length) {
            return false;
          }
        }
      } else if (Array.isArray(fields[i])) {
        if (fields[i].filter(d => !!d).length) {
          return false;
        }
      } else if (fields[i]) {
        return false;
      }
    }

    return true;
  }

  static getValidateFunctions() {
    return {
      reuqired: (val) => {
        if (!val || !val.length) {
          return VALIDATION_REQUIRED_ERROR;
        }
        return null;
      },
      url: (val) => {
        if (val) {
          return !validUrl(val) ? VALIDATION_URL_ERROR : null;
        }
        return null;
      },
      inputMaxLength: (val) => {
        if (val) {
          return val.length > VALIDATION_INPUT_MAX_LENGTH ? VALIDATION_INPUT_MAX_LENGTH_ERROR : null;
        }
        return null;
      },
      textareaMaxLength: (val) => {
        if (val) {
          return val.length > VALIDATION_TEXTAREA_MAX_LENGTH ? VALIDATION_TEXTAREA_MAX_LENGTH_ERROR : null;
        }
        return null;
      },
      email: (val) => {
        if (val) {
          return !REGEX_EMAIL.test(String(val).toLowerCase()) ? VALIDATION_EMAIL_ERROR : null;
        }
        return null;
      },
    };
  }

  static validateUser(data) {
    const {
      reuqired, url, inputMaxLength, textareaMaxLength,
    } = Validate.getValidateFunctions();

    return Validate.validate(data, {
      firstName: [reuqired, inputMaxLength],
      about: [textareaMaxLength],
      personalWebsiteUrl: [url, inputMaxLength],
      usersSources: [{
        sourceUrl: [reuqired, url, inputMaxLength],
      }],
    });
  }

  static validateOrganization(data) {
    const {
      reuqired, url, inputMaxLength, textareaMaxLength, email,
    } = Validate.getValidateFunctions();

    return Validate.validate(data, {
      title: [reuqired, inputMaxLength],
      nickname: [reuqired, inputMaxLength],
      about: [textareaMaxLength],
      country: [inputMaxLength],
      city: [inputMaxLength],
      personalWebsiteUrl: [url, inputMaxLength],
      email: [reuqired, email, inputMaxLength],
      phoneNumber: [inputMaxLength],
      socialNetworks: [{
        sourceUrl: [reuqired, url, inputMaxLength],
      }],
    });
  }

  static parseResponseError(response) {
    if (!isObject(response) || !isObject(response.data) || !isArray(response.data.errors)) {
      return {};
    }

    return response.data.errors.reduce((obj, item) => ({
      ...obj,
      [item.field]: item.message,
    }), {});
  }
}
