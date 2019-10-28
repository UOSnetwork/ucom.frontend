import { useTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import sectionStyles from '../Section/styles.css';
import styles from './styles.css';

const EntryCreatedAt = (props) => {
  const { t } = useTranslation();

  if (!props.date) {
    return null;
  }

  return (
    <div className={sectionStyles.section}>
      <div className={sectionStyles.content}>
        <div className={styles.createdAt}>
          <strong>{t('Created')}</strong> {moment(props.date).format('D MMM YYYY')}
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
