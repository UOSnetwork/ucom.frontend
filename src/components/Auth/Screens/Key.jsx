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
          title={props.title || t('Enter Private Active Key')}
          placeholder={props.placeholder || t('Active Private Key')}
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
          {props.backText || t('I don’t have Active key')}
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
