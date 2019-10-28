import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../Section/styles.css';

const EntryLocation = (props) => {
  const { t } = useTranslation();

  if (!props.city && !props.country) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.title}>{t('Location')}</div>
      <div className={styles.content}>
        {props.city && props.country && `${props.city}, ${props.country}`}
        {props.city && !props.country && `${props.city}`}
        {!props.city && props.country && `${props.country}`}
      </div>
    </div>
  );
};

EntryLocation.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
};

EntryLocation.defaultProps = {
  city: null,
  country: null,
};

export default EntryLocation;
