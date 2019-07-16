import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import IconArrowRight from '../../Icons/ArrowRight';
import IconDuck from '../../Icons/Socials/Duck';
import styles from './styles.css';

const Footer = () => {
  const state = useSelector(state => state.searchPopup);
  const duckLink = `https://duckduckgo.com/?q=${state.query}&sites=u.community&ia=web`;

  if (!state.visible) {
    return null;
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={duckLink}
      className={classNames({
        [styles.footer]: true,
        [styles.active]: state.query,
      })}
    >
      <span className={styles.text}>
        Locate “{state.query}” in posts and publications
      </span>
      <span className={styles.iconDuck}>
        <IconDuck />
      </span>
      <span className={styles.iconArrow}>
        <IconArrowRight />
      </span>
    </a>
  );
};

export default Footer;
