import { get, isEqual } from 'lodash';

export default (props = []) => (prev, next) =>
  props.every(prop => isEqual(get(prev, prop), get(next, prop)));
