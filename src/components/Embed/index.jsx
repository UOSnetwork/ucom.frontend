import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import { validUrl } from '../../utils/url';
import ButtonRemove from '../ButtonRemove';
import Video from './Video';
import Card from './Card';

const Embed = ({
  url,
  imageUrl,
  title,
  description,
  onClickRemove,
  videoUrl,
  videoAspectRatio,
}) => {
  if (!validUrl(url)) {
    return null;
  }

  return (
    <div data-embed={url}>
      {onClickRemove &&
        <span className={styles.remove}>
          <ButtonRemove onClick={onClickRemove} />
        </span>
      }
      {validUrl(videoUrl) ? (
        <Video
          {...{
            url,
            videoUrl,
            videoAspectRatio,
            imageUrl,
            title,
          }}
        />
      ) : (
        <Card
          {...{
            url,
            imageUrl,
            title,
            description,
          }}
        />
      )}
    </div>
  );
};

Embed.propTypes = {
  url: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onClickRemove: PropTypes.func,
  videoUrl: PropTypes.string,
  videoAspectRatio: PropTypes.number,
};

Embed.defaultProps = {
  url: '',
  imageUrl: '',
  title: '',
  description: '',
  onClickRemove: undefined,
  videoUrl: '',
  videoAspectRatio: undefined,
};

export default Embed;
