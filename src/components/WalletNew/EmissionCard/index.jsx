import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import * as Icons from '../Icons';

const EmissionCard = ({
  icon, amount, label, onClick,
}) => (
  <div role="presentation" className={styles.emissionCard} onClick={onClick}>
    <div className={styles.icon}>{icon}</div>
    <div>
      <div className={styles.amount}>{amount}</div>
      <div className={styles.label}>{label}</div>
    </div>
    <div className={styles.action}>Get</div>
  </div>
);

EmissionCard.propTypes = {
  icon: PropTypes.node,
  amount: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

EmissionCard.defaultProps = {
  icon: <Icons.Emission />,
  amount: '…',
  label: 'Your Emission',
  onClick: undefined,
};

export default EmissionCard;
