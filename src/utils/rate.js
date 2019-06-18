import { memoize } from 'lodash';

export const formatRate = memoize((rate, showSign = false) => (
  `${rate ? rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}${showSign ? '°' : ''}`
), (rate, showSign) => `${rate}${showSign}`);
