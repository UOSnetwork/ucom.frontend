import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import React, { memo, Fragment, useState } from 'react';
import styles from '../../styles.css';
import IconArrowLeft from '../../../Icons/ArrowLeft';
import withLoader from '../../../../utils/withLoader';
import * as authActions from '../../../../actions/auth';
import BrainkeyForm from '../../Forms/BrainkeyForm';
import { parseResponseError } from '../../../../utils/errors';

const GenerateSocialKey = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Fragment>
      <div
        role="presentation"
        className={styles.navigation}
        onClick={props.onClickBack}
      >
        <span className={styles.icon}>
          <IconArrowLeft />
        </span>
        <span className={styles.label}>
          <span className={styles.navText}>Authorization</span>
        </span>
      </div>

      <div className={`${styles.content} ${styles.generateKey}`}>
        <div className={styles.main}>
          <BrainkeyForm
            loading={loading}
            error={error}
            title="Generate Social Key with Brainkey"
            onChange={(value) => {
              setError('');
              if (props.onChange) {
                props.onChange(value);
              }
            }}
            onSubmit={async (brainkey) => {
              setLoading(true);
              setTimeout(async () => {
                try {
                  const socialKey = await withLoader(dispatch(authActions.recoveryByBrainkey(brainkey, props.accountName)));
                  props.onSubmit(socialKey);
                } catch (err) {
                  const errors = parseResponseError(err);
                  setError(errors[0].message);
                }
                setLoading(false);
              }, 10);
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

GenerateSocialKey.propTypes = {
  onClickBack: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  accountName: PropTypes.string.isRequired,
};

GenerateSocialKey.defaultProps = {
  onChange: undefined,
};

export default memo(GenerateSocialKey);
