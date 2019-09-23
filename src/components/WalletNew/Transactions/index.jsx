import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Transaction from './Transaction';
import Spinner from '../../Spinner';

const Transactions = ({ sections, showLoader }) => (
  <div className={styles.transactions}>
    {sections.map((section, index) => (
      <div className={styles.section} key={index}>
        <div className={styles.title}>{section.title}</div>

        {section.list.map((item, index) => (
          <div className={styles.item} key={index}>
            <Transaction {...item} />
          </div>
        ))}
      </div>
    ))}
    {showLoader &&
      <div className={styles.loader}>
        <Spinner size={40} color="rgba(0,0,0,0.2)" />
      </div>
    }
  </div>
);

Transactions.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape(Transaction.propTypes)),
  })),
  showLoader: PropTypes.bool,
};

Transactions.defaultProps = {
  sections: [],
  showLoader: true,
};

export default Transactions;
