import { isString, isObject, isNumber, pick, omitBy, isUndefined, size, find } from 'lodash';

export const getEntryImageAttr = (entry, type, attr, index) => {
  try {
    return entry.entityImages[type][index][attr];
  } catch (e) {
    return null;
  }
};

export const removeCoverImage = entry => ({ ...entry, articleTitle: [] });

export const changeCoverImageUrl = (entry, url) => {
  if (isString(entry)) {
    entry = JSON.parse(entry);
  }

  return {
    ...entry,
    articleTitle: [{ url }],
  };
};

export const getCoverImage = entry =>
  getEntryImageAttr(entry, 'articleTitle', 'url', 0);

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

  if (!Array.isArray(entityImages.embeds)) {
    entityImages.embeds = [];
  }

  if (!find(entityImages.embeds, { url: dataToSave.url })) {
    entityImages.embeds.push(dataToSave);
  }

  return entityImages;
};

export const removeEmbed = (entityImages, embedIndex) => {
  if (!entityImages) {
    throw new Error('EntityImages is required argument');
  }

  if (!isNumber(embedIndex)) {
    throw new Error('EmbedIndex is required argument');
  }

  if (!Array.isArray(entityImages.embeds)) {
    entityImages.embeds = [];
  }

  entityImages.embeds.splice(embedIndex, 1);

  return entityImages;
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

  if (!Array.isArray(entityImages.embeds)) {
    entityImages.embeds = [];
  }

  entityImages.embeds = entityImages.embeds
    .filter(embed => urls.includes(embed.url));

  return entityImages;
};
