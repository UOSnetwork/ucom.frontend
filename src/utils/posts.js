import { truncate, memoize } from 'lodash';
import { removeLineBreaksMultipleSpacesAndTrim, searchTags } from '../utils/text';
import {
  EVENT_ID_USER_TRUSTS_YOU,
  EVENT_ID_USER_UNTRUSTS_YOU,
  POST_TYPE_MEDIA_ID,
  POST_TYPE_DIRECT_ID,
  POST_TYPE_OFFER_ID,
  POST_TYPE_REPOST_ID,
  getUserName,
  urls,
  getAutoupdateEventId,
  getAutoupdateTargetEntity,
} from './index';
import * as EntityImages from './entityImages';

export const POSTS_TITLE_MAX_LENGTH = 255;
export const POSTS_LEADING_TEXT_MAX_LENGTH = 255;
export const POSTS_DESCRIPTION_PREVIEW_LIMIT = 400;

export const POSTS_DRAFT_LOCALSTORAGE_KEY = 'post_data_v_1';

export const POSTS_CATREGORIES = [{
  id: 2,
  name: 'trending',
}, {
  id: 1,
  name: 'hot',
}, {
  id: 3,
  name: 'fresh',
}, {
  id: 4,
  name: 'top',
}];

export const getPostTypeById = (postTypeId) => {
  switch (postTypeId) {
    case POST_TYPE_DIRECT_ID:
      return 'post';
    case POST_TYPE_OFFER_ID:
      return 'offer';
    case POST_TYPE_MEDIA_ID:
      return 'story';
    case POST_TYPE_REPOST_ID:
      return 'repost';
    default:
      return null;
  }
};

export const getPostBody = ({
  createdAt,
  description,
  mainImageFilename,
  leadingText,
  title,
}) => {
  const createdAtTime = Number.isInteger(+createdAt) ? +createdAt : new Date(createdAt);
  const newPostsTime = 1545226768471;
  const postIsNewEditor = createdAtTime - newPostsTime > 0;
  let postBody = description;

  if (!postIsNewEditor) {
    if (mainImageFilename) {
      postBody = `<p><img src="${urls.getFileUrl(mainImageFilename)}" /></p>`.concat(postBody);
    }

    if (leadingText) {
      postBody = `<h2>${leadingText}</h2>`.concat(postBody);
    }

    if (title) {
      postBody = `<h1>${title}</h1>`.concat(postBody);
    }
  }

  return postBody;
};

export const getPostCoverUrl = (post) => {
  try {
    return post.entityImages.articleTitle[0].url;
  } catch (e) {
    return null;
  }
};

export const parseMediumContent = memoize((html) => {
  let entityImages;

  const sentences = html.split(/<[^]+?>/g)
    .map(s => s.replace(/<\/?[^>]+(>|$)/g, ''))
    .map(s => s.trim())
    .filter(s => !!s);

  const title = truncate(sentences[0], {
    length: POSTS_TITLE_MAX_LENGTH,
    separator: ' ',
  });

  const leadingText = truncate(sentences[1], {
    length: POSTS_LEADING_TEXT_MAX_LENGTH,
    separator: ' ',
  });

  const description = html.replace('src="http:', 'src="https:');

  const imgSrc = /<img.*?src="(.*?)"/.exec(html);

  if (imgSrc) {
    entityImages = {
      articleTitle: [{
        url: imgSrc[1],
      }],
    };
  }

  return ({
    title,
    leadingText,
    entityImages,
    description,
  });
});

// TODO: Refactor with regexp
export const mediumHasContent = (html = '') => {
  if (typeof document === 'undefined') {
    return false;
  }

  const div = document.createElement('div');
  div.innerHTML = html;
  const hasTextContent = removeLineBreaksMultipleSpacesAndTrim(div.textContent).length > 0;
  const hasImagesOrIframes = div.querySelectorAll('iframe, img').length > 0;

  return hasTextContent || hasImagesOrIframes;
};

export const getPublicationMetaTags = (post) => {
  const articleTitle = post.entityImages && post.entityImages.articleTitle;
  const image = articleTitle && articleTitle[0] && articleTitle[0].url;

  return {
    image,
    type: 'article',
    title: post.title,
    description: post.leadingText,
    keywords: searchTags(post.description).join(','),
  };
};

export const getMetatagsForUserPage = user => ({
  title: getUserName(user),
  description: user.about,
  image: urls.getFileUrl(user.avatarFilename),
});

export const getPostPopupMetatagsForUserPage = (post, user) => ({
  title: getUserName(user),
  description: (post && post.description) || user.about,
  image: EntityImages.getFirstImage(post) || urls.getFileUrl(user.avatarFilename),
});

export const getAutoupdateMetatagsForUserPage = (post, user) => {
  const eventId = getAutoupdateEventId(post);
  const targetEntity = getAutoupdateTargetEntity(post);
  const description = (() => {
    switch (eventId) {
      case EVENT_ID_USER_TRUSTS_YOU:
        return `Trsut ${getUserName(targetEntity.user)}`;
      case EVENT_ID_USER_UNTRUSTS_YOU:
        return `Untrsut ${getUserName(targetEntity.user)}`;
      default:
        return user.about;
    }
  })();

  return {
    description,
    title: getUserName(user),
    image: urls.getFileUrl(user.avatarFilename),
  };
};

export const getPostImages = content => (
  (content.match(/<img.*?src\s*=\s*\\*"(.+?)\\*"\s*\/>/g) || [])
    .map(str => str.match(/src=\"(.*)\"/)[1])
);
