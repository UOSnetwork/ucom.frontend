import PropTypes from 'prop-types';
import React, { useState, Fragment, memo } from 'react';
import styles from './styles.css';
import Image from './Image';
import Popup from './Popup';

const Gallery = ({ images, userId, date }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const moreLabel = images.length > 5 ? `+ ${images.length - 5}` : null;

  if (!images.length) {
    return null;
  }

  return (
    <Fragment>
      {popupVisible &&
        <Popup
          index={activeIndex}
          date={date}
          userId={userId}
          images={images}
          onClickClose={() => setPopupVisible(false)}
        />
      }

      <div className={styles.gallery}>
        {images.slice(0, 5).map((image, index) => (
          <Image
            {...image}
            key={index}
            label={index === 4 ? moreLabel : null}
            onClick={() => {
              setActiveIndex(index);
              setPopupVisible(true);
            }}
          />
        ))}
      </div>
    </Fragment>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape(Image.propTypes)),
  userId: PropTypes.number,
  date: PropTypes.string,
};

Gallery.defaultProps = {
  images: [],
  userId: null,
  date: null,
};

export { default as GalleryPopup } from './Popup';
export default memo(Gallery);
