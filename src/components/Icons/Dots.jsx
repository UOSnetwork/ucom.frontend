import { memoize } from 'lodash';
import React from 'react';

export default memoize(() => (
  <svg width="19" height="4" viewBox="0 0 19 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2" cy="2" r="2" />
    <circle cx="9.00391" cy="2" r="2" />
    <circle cx="16.0039" cy="2" r="2" />
  </svg>
), () => true);
