import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './styles.css';
import IconPlay from '../../Icons/Play';
import { extractSitename } from '../../../utils/url';

const Video = ({
  url,
  videoUrl,
  videoAspectRatio,
  imageUrl,
  title,
}) => {
  let paddingBottom;
  const [active, setActive] = useState(false);

  if (videoAspectRatio) {
    paddingBottom = `${100 / videoAspectRatio}%`;
  }

  return (
    <div
      className={styles.video}
      style={{
        paddingBottom,
      }}
    >
      {active ? (
        <iframe
          title={title}
          allowFullScreen
          frameBorder="0"
          src={videoUrl}
          allow="autoplay"
        />
      ) : (
        <div
          role="presentation"
          className={styles.cover}
          onClick={() => {
            setActive(true);
          }}
        >
          <img src={imageUrl} alt="" />
          <span className={styles.play}>
            <IconPlay />
          </span>
          <span className={styles.site}>{extractSitename(url)}</span>
        </div>
      )}
    </div>
  );
};

Video.propTypes = {
  url: PropTypes.string.isRequired,
  videoUrl: PropTypes.string.isRequired,
  videoAspectRatio: PropTypes.number,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Video.defaultProps = {
  videoAspectRatio: undefined,
};

export default Video;
