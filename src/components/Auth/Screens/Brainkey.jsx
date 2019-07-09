import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.css';
import BrainkeyForm from '../Forms/BrainkeyForm';

const Brainkey = props => (
  <div className={`${styles.content} ${styles.generateKey}`}>
    <div className={styles.main}>
      <BrainkeyForm
        title={props.title}
        description={props.description}
        error={props.error}
        loading={props.loading}
        onChange={props.onChange}
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

Brainkey.propTypes = {
  ...BrainkeyForm.propTypes,
  backText: PropTypes.string.isRequired,
  onClickBack: PropTypes.func.isRequired,
};

Brainkey.defaultProps = {
  ...BrainkeyForm.defaultProps,
};

export default Brainkey;
