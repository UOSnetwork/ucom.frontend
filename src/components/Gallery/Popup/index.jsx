import PropTypes from 'prop-types';
import React, { useState, useEffect, memo } from 'react';
import Popup from '../../Popup';
import IconArrowLeft from '../../Icons/ArrowLeft';
import IconArrowRight from '../../Icons/ArrowRight';
import IconClose from '../../Icons/Close';
import { UserCard } from '../../SimpleCard';
import { isLeftArrowKey, isRightArrowKey } from '../../../utils/keyboard';
import styles from './styles.css';

const GalleryPopup = ({
  onClickClose, images, index, userId, date,
}) => {
  const [activeIndex, setActiveIndex] = useState(index);
  const enabledNext = activeIndex + 1 < images.length;
  const enabledPrev = activeIndex - 1 >= 0;

  const getTransforms = (length, cursor = 0) => {
    const result = [];

    for (let i = 0 - cursor; i < length - cursor; i++) {
      if (i === 0) {
        result.push({
          transform: 'translateX(0px) scale(1)',
          zIndex: length,
        });
      } else if (i > 0) {
        result.push({
          transform: `translateX(${Math.sqrt(i * 3000)}px) scale(${(length - Math.abs(i)) / length})`,
          zIndex: length - Math.abs(i),
          filter: 'brightness(0.8)',
        });
      } else {
        result.push({
          transform: `translateX(-${Math.sqrt(Math.abs(i) * 3000)}px) scale(${(length - Math.abs(i)) / length})`,
          zIndex: length - Math.abs(i),
          filter: 'brightness(0.8)',
        });
      }
    }

    return result;
  };

  const transforms = getTransforms(images.length, activeIndex);

  const onKeyDown = (e) => {
    if (isLeftArrowKey(e) && enabledPrev) {
      setActiveIndex(activeIndex => activeIndex - 1);
    } else if (isRightArrowKey(e) && enabledNext) {
      setActiveIndex(activeIndex => activeIndex + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyDown);
    };
  }, [activeIndex]);

  return (
    <Popup dark alignTop onClickClose={onClickClose}>
      <div className={styles.popup}>
        <span
          role="presentation"
          className={styles.close}
          onClick={onClickClose}
        >
          <IconClose />
        </span>

        <button
          disabled={!enabledPrev}
          className={styles.prev}
          onClick={() => setActiveIndex(activeIndex - 1)}
        >
          <IconArrowLeft />
        </button>

        <button
          disabled={!enabledNext}
          className={styles.next}
          onClick={() => setActiveIndex(activeIndex + 1)}
        >
          <IconArrowRight />
        </button>

        <div className={styles.activeImage}>
          <img
            role="presentation"
            src={images[activeIndex].url}
            alt={images[activeIndex].alt}
            onClick={onClickClose}
          />
        </div>
        <div className={styles.toolbar}>
          <div className={styles.userCard}>
            {date &&
              <div className={styles.date}>{date}</div>
            }
            <UserCard userId={userId} />
          </div>

          <div className={styles.thumbs}>
            {images.map((item, index) => (
              <div
                key={index}
                role="presentation"
                className={styles.thumb}
                style={transforms[index]}
                onClick={() => {
                  setActiveIndex(index);
                }}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                />
              </div>
            ))}
          </div>

          <div className={styles.counter}>
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </Popup>
  );
};

GalleryPopup.propTypes = {
  index: PropTypes.number,
  userId: PropTypes.number.isRequired,
  date: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({
    alt: PropTypes.string,
    url: PropTypes.string,
  })),
  onClickClose: PropTypes.func,
};

GalleryPopup.defaultProps = {
  index: 0,
  date: undefined,
  images: [],
  onClickClose: undefined,
};

export default memo(GalleryPopup);
