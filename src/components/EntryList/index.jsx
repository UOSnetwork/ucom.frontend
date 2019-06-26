import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useState, Fragment } from 'react';
import EntryCard from '../EntryCard';
import styles from '../List/styles.css';
import EntryListPopup from '../EntryListPopup';
import { filterURL } from '../../utils/url';

export const EntryItem = (props) => {
  const LinkTag = props.isExternal ? 'a' : Link;

  return (
    <LinkTag
      key={props.id}
      to={props.url}
      href={filterURL(props.url)}
      className={styles.item}
      target={props.isExternal ? '_blank' : undefined}
    >
      <EntryCard
        {...props}
        disabledLink
      />
    </LinkTag>
  );
};

EntryItem.propTypes = {
  ...EntryCard.propTypes,
  id: PropTypes.number.isRequired,
  follow: PropTypes.bool,
};

EntryItem.defaultProps = {
  ...EntryCard.defaultProps,
  follow: false,
};

const EntryList = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);

  if (!props.data.length) {
    return null;
  }

  const visibleItems = props.data.slice(0, props.limit);

  return (
    <Fragment>
      {visibleItems.map(item => <EntryItem key={item.id} {...{ ...item }} />)}

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
  data: PropTypes.arrayOf(PropTypes.shape(EntryItem.propTypes)),
  limit: PropTypes.number,
  title: PropTypes.string.isRequired,
  onChangePage: PropTypes.func,
  popupData: PropTypes.arrayOf(PropTypes.shape(EntryItem.propTypes)),
  popupMetadata: EntryListPopup.propTypes.metadata,
  onClickViewAll: PropTypes.func,
  showViewMore: PropTypes.bool,
};

EntryList.defaultProps = {
  data: [],
  limit: 3,
  onChangePage: null,
  popupData: undefined,
  popupMetadata: undefined,
  showViewMore: undefined,
  onClickViewAll: undefined,
};

export default EntryList;
