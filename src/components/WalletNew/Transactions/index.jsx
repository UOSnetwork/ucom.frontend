import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Transaction from './Transaction';

const Transactions = ({ sections }) => (
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
  </div>
);

Transactions.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape(Transaction.propTypes)),
  })),
};

Transactions.defaultProps = {
  sections: [],
};

export default Transactions;
