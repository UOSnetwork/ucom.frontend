import PropTypes from 'prop-types';
import React, { useState, Fragment, memo } from 'react';
import styles from './styles.css';
import Image from './Image';
import Popup from './Popup';
import { validImageUrl } from '../../utils/url';

const Gallery = ({ images, userId, date }) => {
  const validImages = images.filter(i => validImageUrl(i.url));
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const moreLabel = validImages.length > 5 ? `+ ${validImages.length - 5}` : null;

  if (!validImages.length) {
    return null;
  }

  return (
    <Fragment>
      {popupVisible &&
        <Popup
          index={activeIndex}
          date={date}
          userId={userId}
          images={validImages}
          onClickClose={() => setPopupVisible(false)}
        />
      }

      <div className={styles.gallery}>
        {validImages.slice(0, 5).map((image, index) => (
          <Image
            {...image}
            key={index}
            label={index === 4 ? moreLabel : null}
            fullView={index === 0}
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
