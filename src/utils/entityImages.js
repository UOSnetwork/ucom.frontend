import _ from 'lodash';

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
  if (_.isString(entry)) {
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
  if (_.isString(entry)) {
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
