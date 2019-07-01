import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const VotingFeatures = ({ items }) => (
  <div className={styles.features}>
    {items.map((item, index) => (
      <div key={index}>
        <h2 className={styles.name}>{item.title}</h2>
        <p className={styles.text}>{item.text}</p>
      </div>
    ))}
  </div>
);

VotingFeatures.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default VotingFeatures;
