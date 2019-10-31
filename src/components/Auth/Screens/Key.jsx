import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.css';
import KeyForm from '../Forms/KeyForm';

const ActiveKey = (props) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.content} ${styles.generateKey}`}>
      <div className={styles.main}>
        <KeyForm
          loading={props.loading}
          title={props.title || t('auth.enterPrivateActiveKey')}
          placeholder={props.placeholder || t('auth.activePrivateKey')}
          submitText="Proceed"
          onSubmit={props.onSubmit}
        />
      </div>
      <div className={styles.bottom}>
        <span
          className="link red-hover"
          role="presentation"
          onClick={props.onClickBack}
        >
          {props.backText || t('auth.dontHaveActive')}
        </span>
      </div>
    </div>
  );
};

ActiveKey.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  backText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ActiveKey.defaultProps = {
  title: undefined,
  placeholder: undefined,
  backText: undefined,
  loading: false,
};

export default ActiveKey;
