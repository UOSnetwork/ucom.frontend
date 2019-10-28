import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import React, { Fragment } from 'react';
import { LIST_PER_PAGE } from '../../utils/constants';
import styles from './styles.css';

const PaginationWrapper = (props) => {
  const { t } = useTranslation();

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
            {t('Show More')}
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
              return <a>{t('Prev')}</a>;
            case 'next':
              return <a>{t('Next')}</a>;
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
  page: 1,
  perPage: LIST_PER_PAGE,
  onClickShowMore: undefined,
  onChange: undefined,
  totalAmount: 0,
};

export default PaginationWrapper;
