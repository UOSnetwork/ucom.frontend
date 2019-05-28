import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Comments/Form/Image';
import PreloaderImage from '../Comments/Form/PreloaderImage';
import { removeGalleryImage } from '../../utils/entityImages';
import styles from './styles.css';

const PreviewImagesGrid = ({
  images,
  onClickRemove,
}) => {
  if (!images.length) {
    return null;
  }

  return (
    <div className={styles.list}>
      {images.map((image, index) => (
        image.url ?
          <Image
            key={index}
            src={image.url}
            onClickRemove={() => onClickRemove(index)}
          /> :
          <PreloaderImage
            key={index}
          />
        ))}
    </div>
  );
};

const PreviewImagesGridForGallery = ({
  setEntityImages, entityImages,
}) => (
  <PreviewImagesGrid
    images={entityImages.gallery}
    onClickRemove={index => setEntityImages(removeGalleryImage(entityImages, index))}
  />
);

PreviewImagesGrid.propTypes = {
  onClickRemove: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.any),
};


PreviewImagesGrid.defaultProps = {
  images: [],
};


PreviewImagesGridForGallery.propTypes = {
  setEntityImages: PropTypes.func.isRequired,
  entityImages: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PreviewImagesGridForGallery;
