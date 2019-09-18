import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Popup from '../Popup';
import Close from '../Close';
import AccountCard from './AccountCard';
import EmissionCard from './EmissionCard';
import Transactions from './Transactions';

const Wallet = ({ accountCard, emissionCards, transactions }) => (
  <Popup alignTop>
    <Close top right onClick={() => {}} />

    <div className={styles.layout}>
      <div className={styles.side}>
        <div className={styles.inner}>
          {emissionCards.length > 0 &&
            <div className={styles.emissionCards}>
              {emissionCards.map((props, index) => (
                <EmissionCard key={index} {...props} />
              ))}
            </div>
          }

          <Transactions {...transactions} />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.inner}>
          <AccountCard {...accountCard} />
        </div>
      </div>
    </div>
  </Popup>
);

Wallet.propTypes = {
  accountCard: PropTypes.shape(AccountCard.propTypes),
  emissionCards: PropTypes.arrayOf(PropTypes.shape(EmissionCard.propTypes)),
  transactions: PropTypes.shape(Transactions.propTypes),
};

Wallet.defaultProps = {
  accountCard: AccountCard.defaultProps,
  emissionCards: [],
  transactions: Transactions.defaultProps,
};

export * from './wrappers';
export default Wallet;
