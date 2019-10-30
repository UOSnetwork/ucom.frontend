import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import * as Icons from '../../../../Icons/WalletIcons';

const Memo = ({ text }) => {
  const { t } = useTranslation();

  if (!text) {
    return null;
  }

  return (
    <div className={styles.memo}>
      <div className={styles.header}>
        <Icons.Message /> {t('Memo')}
      </div>
      <div className={styles.body}>{text}</div>
    </div>
  );
};

Memo.propTypes = {
  text: PropTypes.string,
};

Memo.defaultProps = {
  text: undefined,
};

export default Memo;
