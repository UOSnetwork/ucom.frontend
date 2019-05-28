import Validator from './../utils/validator';
import { validURL } from '../utils/url';

export const validateFields = (
  data = {}, fields = [], rules = {}, isAll = false,
  customNames = {},
) => {
  const validation = new Validator(data, rules);

  if (customNames.customName) {
    validation.setAttributeFormatter(() => customNames.customName);
  }

  const isValid = validation.passes();
  const errors = isAll ?
    validation.errors.all() :
    fields.reduce((value, field) => ({ ...value, [field]: validation.errors.get(field) }), {});
  return { isValid, errors };
};

const rule = {
  firstName: value => ((!value || value.trim() === '') && 'Displayed name is required'),
  title: value => ((!value || value.trim() === '') && 'Community Name is required'),

  personalWebsiteUrl: (value) => {
    const error = !value ? false : !validURL(value) && 'Not a valid URL format';
    return error;
  },

  usersSources: [{
    sourceUrl: (value) => {
      const error = !value ? false : !validURL(value) && 'Not a valid URL format';
      return error;
    },
  }],

};

export const validator = (data, rules = rule) => {
  const fields = Object.keys(data);
  const errors = {};

  fields.forEach((field) => {
    const rule = rules[field];

    if (!rule) {
      return;
    }

    if (typeof rule === 'function') {
      errors[field] = rule(data[field]);
    } else if (Array.isArray(rule) && typeof rule[0] === 'function') {
      errors[field] = data[field].map(value => rule[0](value));
    } else if (Array.isArray(rule) && typeof rule[0] === 'object') {
      errors[field] = data[field].map((obj) => {
        const keys = Object.keys(rule[0]);
        const errors = {};
        keys.forEach((key) => {
          errors[key] = rule[0][key](obj[key]);
        });
        return errors;
      });
    }
  });

  return errors;
};

export const isValid = (errors) => {
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
};
