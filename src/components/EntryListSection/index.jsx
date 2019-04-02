import PropTypes from 'prop-types';
import React from 'react';
import styles from '../Section/styles.css';
import EntryList, { entryItemProps, entryListPropTypes } from '../EntryList';

const EntryListSection = (props) => {
  if (!props.data.length) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.title}>{props.title} {props.count}</div>
      <div className={styles.content}>
        <EntryList
          title={props.title}
          data={props.data}
          limit={props.limit}
          showViewMore={props.showViewMore}
          popupData={props.popupData}
          popupMetadata={props.popupMetadata}
          onChangePage={props.onChangePage}
          onClickViewAll={props.onClickViewAll}
        />
      </div>
    </div>
  );
};

EntryListSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(entryItemProps)),
  count: PropTypes.number,
  limit: entryListPropTypes.limit,
  popupData: entryListPropTypes.popupData,
  popupMetadata: entryListPropTypes.popupMetadata,
  onChangePage: entryListPropTypes.onChangePage,
  onClickViewAll: entryListPropTypes.onClickViewAll,
  showViewMore: entryListPropTypes.showViewMore,
};

EntryListSection.defaultProps = {
  data: [],
  count: null,
  limit: undefined,
  popupData: undefined,
  popupMetadata: undefined,
  showViewMore: undefined,
  onChangePage: null,
  onClickViewAll: undefined,
};

export default EntryListSection;
