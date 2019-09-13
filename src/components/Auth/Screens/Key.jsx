import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.css';
import KeyForm from '../Forms/KeyForm';

const ActiveKey = props => (
  <div className={`${styles.content} ${styles.generateKey}`}>
    <div className={styles.main}>
      <KeyForm
        loading={props.loading}
        title={props.title}
        placeholder={props.placeholder}
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
        {props.backText}
      </span>
    </div>
  </div>
);

ActiveKey.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  backText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ActiveKey.defaultProps = {
  title: 'Enter Private Active Key',
  placeholder: 'Active Private Key',
  backText: 'I don’t have Active key',
  loading: false,
};

export default ActiveKey;
