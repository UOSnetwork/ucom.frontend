import { mergeWith } from 'lodash';

export default (...args) => (
  mergeWith.apply(undefined, [...args, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue;
    }
    return undefined;
  }])
);
