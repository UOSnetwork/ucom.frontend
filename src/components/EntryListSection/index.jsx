import PropTypes from 'prop-types';
import React from 'react';
import styles from '../Section/styles.css';
import EntryList, { EntryListItem } from '../EntryList';

const EntryListSection = (props) => {
  if (!props.data.length) {
    return null;
  }

  return (
    <div className={styles.section}>
      {props.titleEnabled &&
        <div className={styles.title}>{props.title} {props.count}</div>
      }
      <div className={styles.content}>
        <EntryList
          followButtonEnabled={props.followButtonEnabled}
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
  titleEnabled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape(EntryListItem.propTypes)),
  count: PropTypes.number,
  limit: EntryList.propTypes.limit,
  popupData: EntryList.propTypes.popupData,
  popupMetadata: EntryList.propTypes.popupMetadata,
  onChangePage: EntryList.propTypes.onChangePage,
  onClickViewAll: EntryList.propTypes.onClickViewAll,
  showViewMore: EntryList.propTypes.showViewMore,
  followButtonEnabled: PropTypes.bool,
};

EntryListSection.defaultProps = {
  titleEnabled: true,
  data: [],
  count: null,
  limit: undefined,
  popupData: undefined,
  popupMetadata: undefined,
  showViewMore: undefined,
  onChangePage: null,
  onClickViewAll: undefined,
  followButtonEnabled: true,
};

export * from './wrappers';
export default EntryListSection;
