import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Card = ({
  children, icon, color,
}) => (
  <div
    className={classNames({
      [styles.container]: true,
      [styles.withBorder]: color,
    })}
    style={{
      borderColor: color,
    }}
  >
    {children}

    <div className={styles.icons}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {color && <div className={styles.circle} style={{ borderColor: color }} />}
    </div>
  </div>
);

Card.propTypes = {
  icon: PropTypes.node,
  color: PropTypes.string,
};

Card.defaultProps = {
  icon: undefined,
  color: undefined,
};

export default Card;
