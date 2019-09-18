import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Popup from '../Popup';
import Close from '../Close';
import AccountCard from './AccountCard';
import EmissionCard from './EmissionCard';
import Transactions from './Transactions';
import TokenCard from './TokenCard';
import Tabs from '../Tabs';

const Wallet = ({
  accountCard, emissionCards, transactions, tokenCards, tabs,
}) => (
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
          <div className={styles.accountCard}>
            <AccountCard {...accountCard} />
          </div>

          <div className={styles.tabs}>
            <Tabs {...tabs} />
          </div>

          {tokenCards.map((props, index) => <TokenCard key={index} {...props} />)}
        </div>
      </div>
    </div>
  </Popup>
);

Wallet.propTypes = {
  accountCard: PropTypes.shape(AccountCard.propTypes),
  emissionCards: PropTypes.arrayOf(PropTypes.shape(EmissionCard.propTypes)),
  transactions: PropTypes.shape(Transactions.propTypes),
  tokenCards: PropTypes.arrayOf(PropTypes.shape(TokenCard.propTypes)),
  tabs: PropTypes.shape(Tabs.propTypes),
};

Wallet.defaultProps = {
  accountCard: AccountCard.defaultProps,
  emissionCards: [],
  transactions: Transactions.defaultProps,
  tokenCards: [],
  tabs: Tabs.defaultProps,
};

export * from './wrappers';
export default Wallet;
