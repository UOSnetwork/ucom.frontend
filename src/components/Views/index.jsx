import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import IconViews from '../Icons/Views';
import styles from './styles.css';

const View = ({ count }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.views}>
      <IconViews />
      <span>{t('Views', { count })}</span>
    </div>
  );
};

View.propTypes = {
  count: PropTypes.number,
};

View.defaultProps = {
  count: 0,
};

export * from './wrappers';
export default View;
