import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Panel from '../Panel';
import Card from './Card';

const TokenCard = ({
  tokens, icon, color, actions,
}) => (
  <Panel actions={actions}>
    <Card color={color} icon={icon}>
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
    </Card>
  </Panel>
);

TokenCard.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    label: PropTypes.string,
  })),
  icon: Card.propTypes.icon,
  color: Card.propTypes.color,
  actions: Panel.propTypes.actions,
};

TokenCard.defaultProps = {
  tokens: [],
  icon: Card.defaultProps.icon,
  color: Card.defaultProps.color,
  actions: Panel.defaultProps.actions,
};

export { default as Placeholder } from './Placeholder';
export default TokenCard;
