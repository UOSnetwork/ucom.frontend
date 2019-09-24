import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import SocialIcon from '../../../SocialIcon';

const Link = ({ url, label }) => (
  <div className={styles.content}>
    <div className={styles.link}>
      <a href={url}>
        <span className={styles.icon}><SocialIcon url={url} /></span>
        <span className={styles.label}>{label}</span>
      </a>
    </div>
  </div>
);

Link.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
};

Link.defaultProps = {
  url: undefined,
  label: undefined,
};

export default Link;
