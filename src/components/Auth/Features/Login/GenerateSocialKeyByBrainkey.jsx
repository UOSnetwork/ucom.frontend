import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import React, { memo, Fragment, useState } from 'react';
import styles from '../../styles.css';
import withLoader from '../../../../utils/withLoader';
import * as authActions from '../../../../actions/auth';
import BrainkeyForm from '../../Forms/BrainkeyForm';
import { parseResponseError } from '../../../../utils/errors';
import BackToAuth from './BackToAuth';

const GenerateSocialKeyByBrainkey = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Fragment>
      <BackToAuth onClick={props.onClickBack} />

      <div className={`${styles.content} ${styles.generateKey}`}>
        <div className={styles.main}>
          <BrainkeyForm
            loading={loading}
            error={error}
            title="Generate Social Key with Brainkey"
            hint="By clicking Proceed you agree that we will generate a Social Permission key and add it to your account if it has not been assigned before."
            onChange={(value) => {
              setError('');
              if (props.onChange) {
                props.onChange(value);
              }
            }}
            onSubmit={async (brainkey) => {
              setLoading(true);
              try {
                const socialKey = await withLoader(dispatch(authActions.recoveryByBrainkey(brainkey, props.accountName)));
                props.onSubmit(socialKey);
              } catch (err) {
                const errors = parseResponseError(err);
                setError(errors[0].message);
              }
              setLoading(false);
            }}
          />
        </div>
        <div className={styles.bottom}>
          <span
            className="link red-hover"
            role="presentation"
            onClick={props.onClickActiveKey}
          >
            I have Active Private Key
          </span>
        </div>
      </div>
    </Fragment>
  );
};

GenerateSocialKeyByBrainkey.propTypes = {
  onClickBack: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onClickActiveKey: PropTypes.func.isRequired,
  accountName: PropTypes.string.isRequired,
};

GenerateSocialKeyByBrainkey.defaultProps = {
  onChange: undefined,
};

export default memo(GenerateSocialKeyByBrainkey);
