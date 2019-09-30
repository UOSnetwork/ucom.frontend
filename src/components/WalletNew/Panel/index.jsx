import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Panel = ({ children, actions }) => (
  <div
    className={styles.panel}
  >
    <div className={styles.content}>{children}</div>
    <div className={styles.actions}>
      {actions.map((item, index) => (
        <div className={styles.action} key={index}>
          <span role="presentation" onClick={item.onClick} className="link red-hover">{item.title}</span>
        </div>
      ))}
    </div>
  </div>
);

Panel.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })),
};

Panel.defaultProps = {
  actions: [],
};

export default Panel;
