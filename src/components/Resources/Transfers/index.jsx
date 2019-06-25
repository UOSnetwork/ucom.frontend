import moment from 'moment';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { LIST_PER_PAGE } from '../../../utils/constants';
import { addErrorNotification } from '../../../actions/notifications';
import Item from './Item';
import loader from '../../../utils/loader';

const Transfers = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsMetadata, setTransactionsMetadata] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (
    page = 1,
    perPage = LIST_PER_PAGE,
  ) => {
    loader.start();
    setLoading(true);
    try {
      const data = await api.getTransactions(perPage, page);
      setTransactions(transactions.concat(data.data));
      setTransactionsMetadata(data.metadata);
    } catch (e) {
      addErrorNotification(e.message);
    }
    loader.done();
    setLoading(false);
  };

  const sortTransactions = (transactions = []) => {
    const result = [];

    transactions.forEach((i) => {
      const date = moment(i.updatedAt).format('D MMMM');
      if (!result.some(i1 => i1.date === date)) {
        const items = transactions.filter(i2 => moment(i2.updatedAt).isSame(i.updatedAt, 'day'));
        result.push({ date, items });
      }
    });

    return result;
  };

  const sortedTransactions = sortTransactions(transactions);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="wallet-activity">
      {sortedTransactions.map((group, i) => (
        <div key={i} className="wallet-activity__block">
          <div className="wallet-activity__date title_xxsmall"><strong>{group.date}</strong></div>
          <div className="wallet-activity__list">
            {group.items.map((item, i) => <Item key={i} {...item} />)}
          </div>
        </div>
      ))}

      {transactionsMetadata.hasMore &&
        <div className="wallet-activity__showmore">
          <button
            disabled={loading}
            className="button-clean button-clean_link"
            onClick={() => fetchTransactions(transactionsMetadata.page + 1)}
          >
            LOAD MORE
          </button>
        </div>
      }
    </div>
  );
};

export default connect(null, {
  addErrorNotification,
})(Transfers);
