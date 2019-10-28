import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import React, { memo, Fragment, useState } from 'react';
import BackToAuth from './BackToAuth';
import styles from '../../styles.css';
import KeyForm from '../../Forms/KeyForm';
import withLoader from '../../../../utils/withLoader';
import * as authActions from '../../../../actions/auth';
import { parseResponseError } from '../../../../utils/errors';

const GenerateSocialKeyByActiveKey = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Fragment>
      <BackToAuth onClick={props.onClickBack} />

      <div className={`${styles.content} ${styles.generateKey}`}>
        <div className={styles.main}>
          <KeyForm
            loading={loading}
            error={error}
            title={t('Generate Social Key with Active Key')}
            placeholder={t('Active Private Key')}
            submitText={t('Proceed')}
            hint={t('By clicking Proceed you agree that we will generate a Social Permission key and add it to your account if it has not been assigned before.')}
            onChange={(value) => {
              setError('');

              if (props.onChange) {
                props.onChange(value);
              }
            }}
            onSubmit={(activeKey) => {
              setLoading(true);
              setTimeout(async () => {
                try {
                  const socialKey = await withLoader(dispatch(authActions.recoveryByActiveKey(activeKey, props.accountName)));
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
        <div className={styles.bottom}>
          <span
            className="link red-hover"
            role="presentation"
            onClick={props.onClickBrainkey}
          >
            {t('I have Brainkey')}
          </span>
        </div>
      </div>
    </Fragment>
  );
};

GenerateSocialKeyByActiveKey.propTypes = {
  onClickBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClickBrainkey: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  accountName: PropTypes.string.isRequired,
};

GenerateSocialKeyByActiveKey.defaultProps = {
  onChange: undefined,
};

export default memo(GenerateSocialKeyByActiveKey);
