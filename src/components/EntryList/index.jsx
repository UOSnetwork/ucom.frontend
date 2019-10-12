import PropTypes from 'prop-types';
import React, { useState, Fragment } from 'react';
import styles from '../List/styles.css';
import EntryListPopup from '../EntryListPopup';
import EntryListItem from './Item';

const EntryList = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);

  if (!props.data.length) {
    return null;
  }

  return (
    <Fragment>
      {props.data.slice(0, props.limit).map(item => (
        <EntryListItem
          key={item.id}
          {...item}
        />
      ))}

      {(props.showViewMore || props.data.length > props.limit) &&
        <div className={styles.more}>
          <span
            role="presentation"
            className={styles.moreLink}
            onClick={() => {
              setPopupVisible(true);
              if (props.onClickViewAll) {
                props.onClickViewAll();
              }
            }}
          >
            View All
          </span>
        </div>
      }

      {popupVisible &&
        <EntryListPopup
          followButtonEnabled={props.followButtonEnabled}
          title={props.title}
          data={props.popupData || props.data}
          onClickClose={() => setPopupVisible(false)}
          metadata={props.popupMetadata}
          onChangePage={props.onChangePage}
        />
      }
    </Fragment>
  );
};

EntryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(EntryListItem.propTypes)),
  limit: PropTypes.number,
  title: PropTypes.string,
  onChangePage: PropTypes.func,
  popupData: PropTypes.arrayOf(PropTypes.shape(EntryListItem.propTypes)),
  popupMetadata: EntryListPopup.propTypes.metadata,
  onClickViewAll: PropTypes.func,
  showViewMore: PropTypes.bool,
  followButtonEnabled: PropTypes.bool,
};

EntryList.defaultProps = {
  data: [],
  limit: 3,
  title: undefined,
  popupData: undefined,
  popupMetadata: undefined,
  showViewMore: undefined,
  onChangePage: null,
  onClickViewAll: undefined,
  followButtonEnabled: true,
};

export { default as EntryListItem } from './Item';
export * from './wrappers';
export default EntryList;
