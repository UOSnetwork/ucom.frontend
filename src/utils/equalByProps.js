import { get } from 'lodash';

export default (props = []) => (prev, next) =>
  props.every(prop => get(prev, prop) === get(next, prop));
