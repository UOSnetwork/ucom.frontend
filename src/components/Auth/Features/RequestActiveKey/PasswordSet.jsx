import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../../Button/index';
import styles from '../../../Resources/Actions/styles.css';

const PasswordSet = props => (
  <form
    className={styles.content}
    onSubmit={async (e) => {
      e.preventDefault();
      props.onSubmit();
    }}
  >
    <h2 className={styles.title}>Sign Transaction</h2>
    <p className={`${styles.text} ${styles.intro}`}>To register this transaction, you need your Private Active Key. You can save it in your browser, encrypted with a password, in order to send your transactions faster.</p>
    <div className={styles.action}>
      <Button
        cap
        big
        red
        strech
        type="submit"
      >
        Set Password
      </Button>
    </div>
    <div className={styles.backLink}>
      <span
        role="presentation"
        className="link red-hover"
        onClick={props.onClickActiveKey}
      >
        Sign the transaction with Private Active key
      </span>
    </div>
  </form>
);

PasswordSet.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClickActiveKey: PropTypes.func.isRequired,
};

export default PasswordSet;
