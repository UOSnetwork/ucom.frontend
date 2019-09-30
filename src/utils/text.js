import { memoize } from 'lodash';
import sanitizeHtml from 'sanitize-html';
import urls from './urls';
import { allowedVideoHosts } from '../../package.json';
import Navigator from './navigator';

export const URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

export const IMG_URL_REGEXP = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

export const sanitizeText = memoize(str => sanitizeHtml(str));

export const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);

export const getPercent = (left, total) => Math.floor((left / total) * 100);

export const escapeHtml = str => (
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
);

export const removeMultipleSpaces = memoize((str = '') => str.replace(/ +(?= )/g, ''));

export const removeMultipleLineBreaks = memoize((str = '') => str.replace(/(\r\n|\r|\n){2,}/g, '$1\n'));

export const removeLineBreaks = memoize((str = '') => str.replace(/\r?\n|\r/g, ''));

export const removeLineBreaksMultipleSpacesAndTrim = memoize((str) => {
  str = removeMultipleSpaces(str);
  str = removeLineBreaks(str);
  str = str.trim();

  return str;
});

const makeActiveLink = (trigger, makeRoute, className) => (...args) => {
  let match = args[0];
  const isFirst = !args[2];
  match = match.toLowerCase();
  const link = match.slice(0, 1) === '>' ? match.slice(1).replace(trigger, '').trim() : match.replace(trigger, '').trim();
  const result = match.slice(0, 1) === '>' ? `> <a href='${makeRoute(link)}' class='${className}' target='_blank'>${match.slice(1)}</a>` :
    `${isFirst ? '' : ' '}<a href='${makeRoute(link)}' class='${className}' target='_blank'>${match[0] === ' ' ? match.slice(1) : match}</a>`;
  return result;
};

export const makeLinkTag = makeActiveLink('#', urls.getTagUrl, 'link red');

export const makeLinkMention = makeActiveLink('@', urls.getUserUrl, 'link red');

export const checkHashTag = memoize((text = '') => text.replace(/(^|\s|>)#[a-zA-Z]\w*/gm, makeLinkTag));

export const searchTags = memoize(str => (str.match(/(^|\s|>)#[a-zA-Z]\w*/gm) || []).map(i => i.substr(i.indexOf('#') + 1, i.length)));

export const existHashTag = memoize((text, tag) => {
  if (!text || !tag) {
    return false;
  }
  const textLowerCase = text.toLowerCase();
  const tagLowerCase = tag.toLowerCase();
  const result = textLowerCase.match(/#[a-zA-Z]\w*/gm);
  if (result) {
    return result.some(i => i === `#${tagLowerCase}`);
  }
  return false;
});

export const checkMentionTag = memoize((text = '') => text.replace(/(^|\s|>)@[a-zA-Z0-9]\w*/gm, makeLinkMention));

export const existMentionTag = (text, tag) => {
  const result = text.match(/@[a-zA-Z0-9]\w*/gm);
  if (result) {
    return result.some(item => item === `@${tag}`);
  }
  return false;
};

export const makeLink = memoize((text = '') => text.replace(URL_REGEX, url => `<a target="_blank" class="link red" href="${url}">${url}</a>`));

export const getTextContent = memoize((content) => {
  const text = document.createElement('div');
  text.innerHTML = content;

  return text.textContent;
});

export const sanitizePostText = memoize(html => sanitizeHtml(html, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'h2', 'h1', 'span', 'pre']),
  allowedIframeHostnames: allowedVideoHosts,
  allowedSchemes: ['http', 'https'],
  allowedAttributes: {
    iframe: ['src', 'allowfullscreen', 'allow'],
    a: ['href', 'name', 'target', 'class'],
    img: ['src'],
    div: ['style'],
  },
  allowedClasses: {
    div: [
      'medium-insert-images',
      'medium-insert-images-grid',
      'medium-insert-images-wide',
      'medium-insert-embeds',
      'medium-insert-embeds-wide',
      'medium-insert-embed',
      'medium-upload-iframe-wrapper',
      'medium-embed',
      'iframe-video-v2',
      'iframe-video',
    ],
    span: [
      'medium-embed-content',
      'medium-embed-img',
      'medium-embed-title',
      'medium-embed-text',
      'medium-embed-link',
    ],
    p: [
      'medium-embed-link',
    ],
    a: [
      'link',
      'red',
      'js-embed',
    ],
    iframe: [
      'iframe-video',
    ],
  },
  allowedStyles: {
    div: {
      'padding-bottom': [/([0-9]*[.])?[0-9]+%$/],
    },
  },
}));

export const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);

  if (Navigator.isIos()) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);
  } else {
    el.select();
  }

  document.execCommand('copy');
  document.body.removeChild(el);
};

export const sanitizeCommentTexWithoutLink = memoize(html => sanitizeHtml(html, {
  allowedTags: ['a'],
  allowedSchemes: ['http', 'https'],
  allowedAttributes: {
    a: ['href', 'target', 'class'],
  },
  textFilter: text => removeMultipleLineBreaks(text),
}));

export const sanitizeEmbedContent = memoize(html => sanitizeHtml(html, {
  allowedTags: [],
  allowedAttributes: {},
}));

export const sanitizeCommentText = html => sanitizeCommentTexWithoutLink(makeLink(html));

export const sanitizePostTitle = memoize(text => sanitizeHtml(text));
