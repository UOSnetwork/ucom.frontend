import humps from 'lodash-humps';
import { validUrl } from './url';
import { isBrainkeySymbolsValid, isBrainkeyLengthValid } from './brainkey';
import {
  VALIDATION_INPUT_MAX_LENGTH,
  VALIDATION_TEXTAREA_MAX_LENGTH,
  VALIDATION_INPUT_MAX_LENGTH_ERROR,
  VALIDATION_TEXTAREA_MAX_LENGTH_ERROR,
  VALIDATION_REQUIRED_ERROR,
  VALIDATION_URL_ERROR,
  REGEX_EMAIL,
  VALIDATION_EMAIL_ERROR,
  ERROR_WRONG_BRAINKEY,
  USER_ACCOUNT_NAME_REG_EXP,
  VALIDATION_ACCOUNT_NAME_ERROR,
} from './constants';

export default class Validate {
  static validate(data = {}, rules = {}) {
    const errors = {};

    Object.keys(rules).forEach((field) => {
      const rule = rules[field];

      if (!rule) {
        return;
      }

      if (Array.isArray(rule) && typeof rule[0] === 'function') {
        const err = rule.map(r => r(data[field])).filter(i => Boolean(i));
        errors[field] = err.length ? err[0] : null;
      } else if (Array.isArray(rule) && Array.isArray(data[field]) && Array.isArray(rule[0])) {
        errors[field] = data[field].map((value) => {
          const err = rule[0].map(r => r(value).filter(i => Boolean(i)));
          return err.length ? err[0] : null;
        });
      } else if (Array.isArray(rule) && Array.isArray(data[field]) && typeof rule[0] === 'object') {
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
      brainkey: (val) => {
        if (val) {
          return !isBrainkeySymbolsValid(val.trim()) || !isBrainkeyLengthValid(val.trim()) ? ERROR_WRONG_BRAINKEY : null;
        }
        return null;
      },
      accountName: (val) => {
        if (val) {
          return !USER_ACCOUNT_NAME_REG_EXP.test(val) ? VALIDATION_ACCOUNT_NAME_ERROR : null;
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
      firstName: [inputMaxLength],
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
      nickname: [reuqired],
      about: [textareaMaxLength],
      country: [inputMaxLength],
      city: [inputMaxLength],
      personalWebsiteUrl: [url, inputMaxLength],
      email: [email, inputMaxLength],
      phoneNumber: [inputMaxLength],
      socialNetworks: [{
        sourceUrl: [reuqired, url, inputMaxLength],
      }],
    });
  }

  static validateLogin(data) {
    const {
      reuqired, brainkey, accountName,
    } = Validate.getValidateFunctions();

    return Validate.validate(data, {
      accountName: [reuqired, accountName],
      brainkey: [reuqired, brainkey],
    });
  }


  static validatePost(data) {
    const {
      reuqired, inputMaxLength,
    } = Validate.getValidateFunctions();

    return Validate.validate(data, {
      title: [reuqired, inputMaxLength],
      leadingText: [reuqired, inputMaxLength],
      description: [reuqired],
    });
  }

  static validateSubscribe(data) {
    const {
      reuqired, email,
    } = Validate.getValidateFunctions();

    return Validate.validate(data, {
      email: [reuqired, email],
    });
  }

  static isResponseErrors(response) {
    try {
      const errors = JSON.parse(response.data.errors);
      return Array.isArray(errors.errors);
    } catch (err) {
      return response && response.data && Array.isArray(response.data.errors);
    }
  }

  static parseResponseError(response) {
    if (!Validate.isResponseErrors(response)) {
      return {};
    }

    let errors;

    try {
      ({ errors } = JSON.parse(response.data.errors));
    } catch (err) {
      ({ errors } = response.data);
    }

    return humps(errors.reduce((obj, item) => ({
      ...obj,
      [item.field]: item.message,
    }), {}));
  }
}
