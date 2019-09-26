import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Panel from '../Panel';

const Resource = ({
  title, total, percentage, actions, used,
}) => (
  <Panel className={styles.resource} actions={actions}>
    <div className={styles.container}>
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
  </Panel>
);

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.string,
  percentage: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    title: PropTypes.string,
  })),
  used: PropTypes.string,
};

Resource.defaultProps = {
  total: undefined,
  percentage: 0,
  actions: [],
  used: undefined,
};

export default Resource;
