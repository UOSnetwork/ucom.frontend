import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../../Button/index';
import styles from '../../../Wallet/Actions/styles.css'; // TODO: Incapsulate styles

const PasswordSet = (props) => {
  const { t } = useTranslation();

  return (
    <form
      className={styles.content}
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onSubmit();
      }}
    >
      <h2 className={styles.title}>{t('auth.signTransaction')}</h2>
      <p className={`${styles.text} ${styles.intro}`}>{t('auth.toRegister')}</p>
      <div className={styles.action}>
        <Button cap big red strech type="submit">
          {t('auth.setPassword')}
        </Button>
      </div>
      <div className={styles.backLink}>
        <span
          role="presentation"
          className="link red-hover"
          onClick={props.onClickActiveKey}
        >
          {t('auth.signTransactionPrivateActiveKey')}
        </span>
      </div>
    </form>
  );
};

PasswordSet.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClickActiveKey: PropTypes.func.isRequired,
};

export default PasswordSet;
