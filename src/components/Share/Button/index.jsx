import { useTranslation } from 'react-i18next';
import React from 'react';
import IconShare from '../../Icons/Share';
import styles from './styles.css';

const Button = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.share}>
      <IconShare />
      <span>{t('Share')}</span>
    </div>
  );
};

export default Button;
