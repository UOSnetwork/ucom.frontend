import { memoize } from 'lodash';

export const extractHostname = (url) => {
  if (!url) {
    return null;
  }

  let hostname;

  if (url.indexOf('//') > -1) {
    [, , hostname] = url.split('/');
  } else {
    [hostname] = url.split('/');
  }

  [hostname] = hostname.split(':');
  [hostname] = hostname.split('?');

  const name = hostname.replace('www.', '').split('.');

  return name.join('.');
};

export const extractSitename = (url) => {
  const hostname = extractHostname(url);

  if (!hostname) {
    return null;
  }

  return hostname.split('.')[0];
};

// https://gist.github.com/jpillora/7885636
/* eslint-disable */
export const validUrl = memoize((str) => {
  const regexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  return !!regexp.test(str);
});
/* eslint-enable */

export const filterURL = (url) => {
  if (validUrl(url)) {
    return url;
  }

  return '';
};

export const isHttpsUrl = url => url.indexOf('https://') === 0;

export const getUrlsFromStr = (str = '') => {
  let result = [];
  const matches = str.match(/\bhttps?:\/\/\S+/gi);

  if (matches) {
    result = matches.filter(url => validUrl(url));
  }

  return result;
};
