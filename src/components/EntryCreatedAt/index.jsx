import moment from 'moment';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import sectionStyles from '../Section/styles.css';
import styles from './styles.css';

const EntryCreatedAt = (props) => {
  if (!props.date) {
    return null;
  }

  return (
    <div className={sectionStyles.section}>
      <div className={sectionStyles.content}>
        <div className={styles.createdAt}>
          <strong>Created</strong> {moment(props.date).format('D MMM YYYY')}
        </div>
      </div>
    </div>
  );
};

EntryCreatedAt.propTypes = {
  date: PropTypes.string,
};

EntryCreatedAt.defaultProps = {
  date: null,
};

export default memo(EntryCreatedAt);
