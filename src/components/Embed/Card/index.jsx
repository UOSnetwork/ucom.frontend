import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import { validUrl, isHttpsUrl, extractHostname } from '../../../utils/url';

const Embed = ({
  url,
  imageUrl,
  title,
  description,
}) => {
  if (!validUrl(url)) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      {validUrl(imageUrl) && isHttpsUrl(imageUrl) &&
        <span className={styles.cover}>
          <img src={imageUrl} alt="" />
        </span>
      }
      <span className={styles.content}>
        {title &&
          <span className={styles.title}>{title}</span>
        }
        {description &&
          <span className={styles.description}>{description}</span>
        }
        <span className={styles.link}>{extractHostname(url)}</span>
      </span>
    </a>
  );
};

Embed.propTypes = {
  url: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

Embed.defaultProps = {
  url: '',
  imageUrl: '',
  title: '',
  description: '',
};

export default Embed;
