import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Transaction = ({
  icon, title, amount, message, onClick,
}) => (
  <div role="presentation" className={styles.transaction} onClick={onClick}>
    <div className={styles.icon}>{icon}</div>
    <div className={styles.name}>{title}</div>
    <div className={styles.amount}>{amount}</div>
    {message &&
      <div className={styles.message}>— {message}</div>
    }
  </div>
);

Transaction.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  amount: PropTypes.string,
  message: PropTypes.string,
  onClick: PropTypes.func,
};

Transaction.defaultProps = {
  icon: undefined,
  title: '…',
  amount: '…',
  message: undefined,
  onClick: undefined,
};

export default Transaction;
