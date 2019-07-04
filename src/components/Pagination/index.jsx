import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import React from 'react';
import { LIST_PER_PAGE } from '../../utils/constants';
import styles from './styles.css';

const PaginationWrapper = (props) => {
  if (!props.totalAmount) {
    return null;
  }

  return (
    <Pagination
      hideOnSinglePage
      className={styles.pagination}
      showTitle={false}
      total={props.totalAmount}
      pageSize={props.perPage}
      current={props.page}
      onChange={props.onChange}
      itemRender={(current, type, element) => {
        switch (type) {
          case 'prev':
            return <a>Prev</a>;
          case 'next':
            return <a>Next</a>;
          default:
            return element;
        }
      }}
    />
  );
};

PaginationWrapper.propTypes = {
  page: PropTypes.number,
  perPage: PropTypes.number,
  totalAmount: PropTypes.number,
  onChange: PropTypes.func,
};

PaginationWrapper.defaultProps = {
  page: 1,
  perPage: LIST_PER_PAGE,
  onChange: undefined,
  totalAmount: 0,
};

export default PaginationWrapper;
