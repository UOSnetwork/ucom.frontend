import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Tags = ({ tags }) => {
  if (!tags.length) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => (
        <Link key={index} className={styles.tag} to={tag.url}>{tag.title}</Link>
      ))}
    </div>
  );
};

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
};

Tags.defaultProps = {
  tags: [],
};

export * from './wrappers';
export default Tags;
