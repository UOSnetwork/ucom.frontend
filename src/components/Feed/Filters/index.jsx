import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Filters = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.filters}>
      {items.map((item, index) => (
        <span
          key={index}
          role="presentation"
          onClick={item.onClick}
          className={classNames({
            [styles.link]: true,
            [styles.active]: item.active,
          })}
        >
          {item.title}{item.totalCount ? ` ${item.totalCount}` : ''}
        </span>
      ))}
    </div>
  );
};

Filters.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    active: PropTypes.bool,
    title: PropTypes.string.isRequired,
    totalCount: PropTypes.number,
    onClick: PropTypes.func.isRequired,
  })),
};

Filters.defaultProps = {
  items: [],
};

export default Filters;
