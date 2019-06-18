import { validUrl } from './url';

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

  static getValidatorFunctions() {
    return {
      reuqired: (val) => {
        if (!val || !val.length) {
          return 'Field can\'t be blank';
        }
        return null;
      },
      url: (val) => {
        if (val) {
          return validUrl(val) ? null : 'Field is not a valid url';
        }
        return null;
      },
    };
  }

  // static validateCategory(categoryData) {
  //   const { reuqired, url } = Validator.getValidatorFunctions();
  //   return Validator.validate(categoryData, {
  //     name: [reuqired],
  //     iconUrl: [reuqired, url],
  //   });
  // }
}




// const INPUT_MAX_LENGTH = 255;
// const TEXTAREA_MAX_LENGTH = 1024;

// validate.validators.array = (items, constraints) => {
//   const errors = items.map(item => validate(item, constraints));

//   return compact(errors).length ? [errors] : null;
// };

// validate.validators.optionalUrl = (value, options, attribute, attributes) => {
//   if (validate.isEmpty(value)) {
//     return null;
//   }

//   return validate.validators.url(value, options, attribute, attributes);
// };

// export const validateUser = data =>
//   validate(data, {
//     firstName: {
//       presence: {
//         allowEmpty: false,
//       },
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     about: {
//       length: {
//         maximum: TEXTAREA_MAX_LENGTH,
//       },
//     },
//     personalWebsiteUrl: {
//       optionalUrl: true,
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     usersSources: {
//       array: {
//         sourceUrl: {
//           presence: true,
//           url: true,
//           length: {
//             maximum: INPUT_MAX_LENGTH,
//           },
//         },
//       },
//     },
//   });

// export const validateOrganization = data =>
//   validate(data, {
//     title: {
//       presence: {
//         allowEmpty: false,
//       },
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     nickname: {
//       presence: {
//         allowEmpty: false,
//       },
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     about: {
//       length: {
//         maximum: TEXTAREA_MAX_LENGTH,
//       },
//     },
//     country: {
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     city: {
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     personalWebsiteUrl: {
//       optionalUrl: true,
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     email: {
//       email: true,
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     phoneNumber: {
//       length: {
//         maximum: INPUT_MAX_LENGTH,
//       },
//     },
//     socialNetworks: {
//       array: {
//         sourceUrl: {
//           optionalUrl: true,
//           length: {
//             maximum: INPUT_MAX_LENGTH,
//           },
//         },
//       },
//     },
//   });
