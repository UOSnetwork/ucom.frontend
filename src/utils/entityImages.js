// TODO: Refactoring gallery images
// TODO: Refactoring to class

import { isString, isObject, isNumber, pick, omitBy, isUndefined, size, find, cloneDeep } from 'lodash';
import { validUrl } from './url';

export const ENTITY_IMAGES_SYMBOLS_LIMIT = 5000;
export const ENTITY_IMAGES_SYMBOLS_LIMIT_ERROR = 'Maximum number of embeds exceeded';

export const getEntryImageAttr = (entry, type, attr, index) => {
  try {
    return entry.entityImages[type][index][attr];
  } catch (e) {
    return null;
  }
};

export const removeCoverImage = entry => ({ ...entry, articleTitle: [] });

export const removeGalleryImage = (entry, index) => ({
  ...entry,
  gallery: entry.gallery.filter((image, id) => id !== index),
});

export const changeCoverImageUrl = (entry, url) => {
  if (isString(entry)) {
    try {
      entry = JSON.parse(entry);
    } catch (err) {
      throw err;
    }
  }

  return {
    ...entry,
    articleTitle: [{ url }],
  };
};

export const addGalleryImages = (entry, newGallery) => {
  if (isString(entry)) {
    try {
      entry = JSON.parse(entry);
    } catch (err) {
      throw err;
    }
  }

  const gallery = entry && entry.gallery ? [...entry.gallery, ...newGallery] : newGallery;

  if (gallery.length > 10) {
    throw new Error('Error: more than 10 images');
  }

  return {
    ...entry,
    gallery,
  };
};

export const addGalleryImagesWithCatch = onError => (entry, gallery) => {
  try {
    return addGalleryImages(entry, gallery);
  } catch (e) {
    onError(e.message);
    return {
      ...entry,
      gallery: gallery.slice(0, 10),
    };
  }
};

export const getCoverImage = entry =>
  getEntryImageAttr(entry, 'articleTitle', 'url', 0);

export const getGalleryImages = (entry) => {
  try {
    return entry.entityImages.gallery.map(image => image.url);
  } catch (e) {
    return [];
  }
};

export const getFirstImage = (entry) => {
  try {
    if (entry.entityImages || entry.entityImages.gallery) {
      return getEntryImageAttr(entry, 'gallery', 'url', 0);
    }

    if (entry.entityImages || entry.entityImages.articleTitle) {
      return getCoverImage(entry);
    }
  } catch (e) {
    return '';
  }
  return '';
};

export const getGalleryImage = entry =>
  getEntryImageAttr(entry, 'gallery', 'url', 0);

export const addEmbed = (entityImages = {}, data) => {
  if (!entityImages) {
    throw new Error('EntityImages is required argument');
  }

  if (!isObject(entityImages)) {
    throw new Error('EntityImages must be object');
  }

  if (!data) {
    throw new Error('Data is required argument');
  }

  const newEntityImages = cloneDeep(entityImages);

  let dataToSave = pick(data, [
    'url',
    'title',
    'description',
    'imageUrl',
    'videoUrl',
    'videoAspectRatio',
  ]);

  dataToSave = omitBy(dataToSave, isUndefined);

  if (!size(dataToSave)) {
    throw new Error('EmbedData is empty');
  }

  if (!Array.isArray(newEntityImages.embeds)) {
    newEntityImages.embeds = [];
  }

  if (!find(newEntityImages.embeds, { url: dataToSave.url })) {
    newEntityImages.embeds.push(dataToSave);
  }

  return newEntityImages;
};

export const removeEmbed = (entityImages, embedIndex) => {
  if (!entityImages) {
    throw new Error('EntityImages is required argument');
  }

  if (!isNumber(embedIndex)) {
    throw new Error('EmbedIndex is required argument');
  }

  const newEntityImages = cloneDeep(entityImages);

  if (!Array.isArray(newEntityImages.embeds)) {
    newEntityImages.embeds = [];
  }

  newEntityImages.embeds.splice(embedIndex, 1);

  return newEntityImages;
};

export const getEmbedByUrl = (entityImages, url) => {
  let result;

  if (!entityImages) {
    throw new Error('EntityImages is required argument');
  }

  if (Array.isArray(entityImages.embeds)) {
    result = find(entityImages.embeds, { url });
  }

  return result;
};

export const hasEmbeds = (entityImages = {}) =>
  Boolean(entityImages.embeds && entityImages.embeds.length);

export const filterEmbedsByUrls = (entityImages, urls) => {
  if (!entityImages) {
    throw new Error('EntityImages is required argument');
  }

  if (!Array.isArray(urls)) {
    throw new Error('Urls must be array');
  }

  const newEntityImages = cloneDeep(entityImages);

  if (!Array.isArray(newEntityImages.embeds)) {
    newEntityImages.embeds = [];
  }

  newEntityImages.embeds = newEntityImages.embeds
    .filter(embed => urls.includes(embed.url));

  return newEntityImages;
};

export const entityAddCover = (entityImages, data) => {
  if (!isObject(entityImages)) {
    throw new Error('EntityImages not valid');
  }

  if (!isObject(data) || !isString(data.url) || !validUrl(data.url)) {
    throw new Error('Data not valid');
  }

  const result = {
    ...entityImages,
    cover: [
      pick(data, 'url'),
    ],
  };

  return result;
};

export const entityRemoveCover = (entityImages) => {
  if (!isObject(entityImages)) {
    throw new Error('EntityImages not valid');
  }

  const result = { ...entityImages };

  delete result.cover;

  return result;
};

export const entityHasCover = (entityImages) => {
  try {
    const { url } = entityImages.cover[0];

    return isString(url) && validUrl(url);
  } catch (err) {
    return false;
  }
};

export const entityGetCoverUrl = (entityImages) => {
  try {
    return entityImages.cover[0].url;
  } catch (err) {
    return null;
  }
};

export const getPostCoverUrlUrl = (entityImages) => {
  try {
    return entityImages.articleTitle[0].url;
  } catch (err) {
    return null;
  }
};

export const changePostCover = (entityImages, url) => {
  if (!isObject(entityImages)) {
    throw new Error('EntityImages not valid');
  }

  if (!isString(url) || !validUrl(url)) {
    throw new Error('Url not valid');
  }

  const result = {
    ...entityImages,
    articleTitle: [{ url }],
  };

  return result;
};

export const removePostCover = entityImages => ({
  ...entityImages,
  articleTitle: [],
});
