import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const TokenCard = ({
  tokens, icon, color, actions,
}) => (
  <div className={styles.tokenCard}>
    <div
      className={classNames({
        [styles.container]: true,
        [styles.withBorder]: color,
      })}
      style={{
        borderColor: color,
      }}
    >
      <div className={styles.tokens}>
        {tokens.map((token, index) => (
          <div
            key={index}
            className={classNames({
              [styles.token]: true,
              [styles.main]: index === 0,
            })}
          >
            <div className={styles.title}>{token.title}</div>
            <div className={styles.label}>{token.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.icons}>
        {icon && <div className={styles.icon}>{icon}</div>}
        {color && <div className={styles.circle} style={{ borderColor: color }} />}
      </div>
    </div>

    <div className={styles.actions}>
      {actions.map((item, index) => (
        <div className={styles.action} key={index}>
          <span role="presentation" onClick={item.onClick} className="link red-hover">{item.title}</span>
        </div>
      ))}
    </div>
  </div>
);

TokenCard.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    label: PropTypes.string,
  })),
  icon: PropTypes.node,
  color: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })),
};

TokenCard.defaultProps = {
  tokens: [],
  icon: undefined,
  color: undefined,
  actions: [],
};

export default TokenCard;
