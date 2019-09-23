import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import styles from './styles.css';
import Popup from '../Popup';
import UserPick from '../../../UserPick';

const Transaction = ({
  icon, title, amount, message, date, type, details, avatarSrc,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <Fragment>
      <div role="presentation" className={styles.transaction} onClick={() => setPopupVisible(true)}>
        <div className={styles.content}>
          {avatarSrc ? (
            <UserPick src={avatarSrc} size={40} />
          ) : (
            <div className={styles.icon}>{icon}</div>
          )}
          <div className={styles.name}>{title}</div>
          <div className={styles.amount}>{amount}</div>
        </div>
        {message && <div className={styles.message}>— {message}</div>}
      </div>
      {popupVisible &&
        <Popup
          onClickClose={() => setPopupVisible(false)}
          date={date}
          type={type}
          icon={icon}
          title={title}
          amount={amount}
          details={details}
          avatarSrc={avatarSrc}
        />
      }
    </Fragment>
  );
};

Transaction.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  amount: PropTypes.string,
  message: PropTypes.string,
  date: PropTypes.string,
  type: PropTypes.string,
  details: PropTypes.string,
  avatarSrc: PropTypes.string,
};

Transaction.defaultProps = {
  icon: undefined,
  title: '…',
  amount: undefined,
  message: undefined,
  date: undefined,
  type: undefined,
  details: undefined,
  avatarSrc: undefined,
};

export default Transaction;
