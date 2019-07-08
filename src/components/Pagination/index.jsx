import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import React, { Fragment } from 'react';
import { LIST_PER_PAGE } from '../../utils/constants';
import styles from './styles.css';

const PaginationWrapper = (props) => {
  if (!props.totalAmount) {
    return null;
  }

  return (
    <Fragment>
      {props.hasMore && props.onClickShowMore &&
        <div className={styles.showMore}>
          <span
            role="presentation"
            className="link"
            onClick={props.onClickShowMore}
          >
            Show More
          </span>
        </div>
      }

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
    </Fragment>
  );
};

PaginationWrapper.propTypes = {
  hasMore: PropTypes.bool,
  onClickShowMore: PropTypes.func,
  page: PropTypes.number,
  perPage: PropTypes.number,
  totalAmount: PropTypes.number,
  onChange: PropTypes.func,
};

PaginationWrapper.defaultProps = {
  hasMore: false,
  onClickShowMore: undefined,
  page: 1,
  perPage: LIST_PER_PAGE,
  onChange: undefined,
  totalAmount: 0,
};

export default PaginationWrapper;
