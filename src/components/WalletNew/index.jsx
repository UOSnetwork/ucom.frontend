import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Popup from '../Popup';
import Close from '../Close';
import AccountCard from './AccountCard';
import EmissionCard from './EmissionCard';

const Wallet = ({ accountCard, emissionCards }) => (
  <Popup alignTop>
    <Close top right onClick={() => {}} />

    <div className={styles.layout}>
      <div className={styles.side}>
        <div className={styles.inner}>
          {emissionCards.map((props, index) => (
            <EmissionCard key={index} {...props} />
          ))}
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
  accountCard: AccountCard.propTypes,
  emissionCards: PropTypes.arrayOf(PropTypes.shape(EmissionCard.propTypes)),
};

Wallet.defaultProps = {
  accountCard: AccountCard.defaultProps,
  emissionCards: [],
};

export * from './wrappers';
export default Wallet;
