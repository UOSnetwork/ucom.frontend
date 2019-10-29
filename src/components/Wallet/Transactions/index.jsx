import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styles from './styles.css';
import Transaction from './Transaction';
import Spinner from '../../Spinner';
import Placeholder from './Placeholder';

const Transactions = ({
  sections, showLoader, showPlaceholder, showEmptyLabel,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.transactions}>
      {showPlaceholder ? (
        <Fragment>
          <Placeholder />
          {showEmptyLabel &&
            <div className={styles.emptyLabel}>{t('No transactions to display at the moment')}</div>
          }
        </Fragment>
      ) : (
        <Fragment>
          {sections.map((section, index) => (
            <div className={styles.section} key={index}>
              {section.title &&
                <div className={styles.title}>{section.title}</div>
              }

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
        </Fragment>
      )}
    </div>
  );
};

Transactions.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape(Transaction.propTypes)),
  })),
  showLoader: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
  showEmptyLabel: PropTypes.bool,
};

Transactions.defaultProps = {
  sections: [],
  showLoader: true,
  showPlaceholder: false,
  showEmptyLabel: false,
};

export default Transactions;
