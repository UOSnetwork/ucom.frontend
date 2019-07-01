import { memoize } from 'lodash';

export const formatRate = memoize(
  (rate, showSign = false) => (
    `${rate ? rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}${showSign ? '°' : ''}`
  ),
  (rate, showSign) => (
    `${rate}${showSign}`
  ),
);

export const formatScaledImportance = memoize(
  (val, showSign = true) => (
    `${Math.ceil((+val || 0) * 10000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${showSign ? '°' : ''}`
  ),
  (val, showSign) => (
    `${val}${showSign}`
  ),
);
