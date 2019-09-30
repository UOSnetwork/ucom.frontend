import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Resource = ({
  title, total, percentage, used,
}) => (
  <div className={styles.resource}>
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      <div className={styles.total}>{total}</div>
    </div>
    {used && <div className={styles.used}>{used}</div>}
    <div className={styles.progress}>
      <div
        className={classNames({
          [styles.percentage]: true,
          [styles.green]: percentage < 50,
          [styles.yellow]: percentage >= 50 && percentage < 90,
          [styles.red]: percentage >= 90,
        })}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.string,
  percentage: PropTypes.number,
  used: PropTypes.string,
};

Resource.defaultProps = {
  total: undefined,
  percentage: 0,
  used: undefined,
};

export default Resource;
