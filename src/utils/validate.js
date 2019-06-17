import validate from 'validate.js';
import { compact } from 'lodash';

const INPUT_MAX_LENGTH = 255;
const TEXTAREA_MAX_LENGTH = 1024;

validate.validators.array = (items, constraints) => {
  const errors = items.map(item => validate(item, constraints));

  return compact(errors).length ? [errors] : null;
};

validate.validators.optionalUrl = (value, options, attribute, attributes) => {
  if (validate.isEmpty(value)) {
    return null;
  }

  return validate.validators.url(value, options, attribute, attributes);
};

export const validateUser = data =>
  validate(data, {
    firstName: {
      presence: {
        allowEmpty: false,
      },
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    about: {
      length: {
        maximum: TEXTAREA_MAX_LENGTH,
      },
    },
    personalWebsiteUrl: {
      optionalUrl: true,
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    usersSources: {
      array: {
        sourceUrl: {
          presence: true,
          url: true,
          length: {
            maximum: INPUT_MAX_LENGTH,
          },
        },
      },
    },
  });

export const validateOrganization = data =>
  validate(data, {
    title: {
      presence: {
        allowEmpty: false,
      },
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    nickname: {
      presence: {
        allowEmpty: false,
      },
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    about: {
      length: {
        maximum: TEXTAREA_MAX_LENGTH,
      },
    },
    country: {
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    city: {
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    personalWebsiteUrl: {
      optionalUrl: true,
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    email: {
      email: true,
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    phoneNumber: {
      length: {
        maximum: INPUT_MAX_LENGTH,
      },
    },
    socialNetworks: {
      array: {
        sourceUrl: {
          optionalUrl: true,
          length: {
            maximum: INPUT_MAX_LENGTH,
          },
        },
      },
    },
  });
