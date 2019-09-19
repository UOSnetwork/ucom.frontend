import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Resource = ({
  title, label, percentage, actions,
}) => (
  <div className={styles.resource}>
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      <div className={styles.label}>{label}</div>
    </div>
    <div className={styles.progress}>
      <div className={styles.percentage} style={{ width: `${percentage}%` }} />
    </div>
    {actions.length > 0 &&
      <div className={styles.actions}>
        {actions.map((action, index) => (
          <div role="presentation" className={styles.action} onClick={action.onClick} key={index}>
            <span className="link red-hover">{action.title}</span>
          </div>
        ))}
      </div>
    }
  </div>
);

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  percentage: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    title: PropTypes.string,
  })),
};

Resource.defaultProps = {
  label: undefined,
  percentage: 0,
  actions: [],
};

export default Resource;
