import validate from 'validate.js';
import { compact } from 'lodash';

validate.validators.array = (items, constraints) => {
  const errors = items.map(item => validate(item, constraints));

  return compact(errors).length ? [errors] : null;
};

export default validate;
