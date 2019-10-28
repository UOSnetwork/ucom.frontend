import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from '../../../styles.css';
import IconArrowLeft from '../../../../Icons/ArrowLeft';

const BackToAuth = (props) => {
  const { t } = useTranslation();

  return (
    <div
      role="presentation"
      className={styles.navigation}
      onClick={props.onClick}
    >
      <span className={styles.icon}>
        <IconArrowLeft />
      </span>
      <span className={styles.label}>
        <span className={styles.navText}>{t('Authorization')}</span>
      </span>
    </div>
  );
};

BackToAuth.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default memo(BackToAuth);
