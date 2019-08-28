import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import Popup, { Content } from '../../../Popup';
import TextInput from '../../../TextInput';
import Button from '../../../Button/index';
import * as authActions from '../../../../actions/auth';
import { addErrorNotificationFromResponse } from '../../../../actions/notifications';
import Validate from '../../../../utils/validate';
import { USER_ACCOUNT_LENGTH } from '../../../../utils/constants';
import withLoader from '../../../../utils/withLoader';
import urls from '../../../../utils/urls';
import { removeMultipleSpaces } from '../../../../utils/text';
import styles from './styles.css';

const LoginSimple = ({ location }) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const [errors, setErrors] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [data, setData] = useState({
    accountName: '',
    brainkey: '',
  });

  const validate = (data) => {
    const { errors, isValid } = Validate.validateLogin(data);

    setErrors(errors);

    return isValid;
  };

  const setDataAndValidate = (data) => {
    setData(data);
    validate(data);
  };

  const submit = async (data) => {
    const isValid = validate(data);

    setSubmited(true);

    if (!isValid || loading) {
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch(authActions.login(data.brainkey.trim(), data.accountName)));
    } catch (err) {
      if (Validate.isResponseErrors(err.response)) {
        setErrors(Validate.parseResponseError(err.response));
      } else {
        dispatch(addErrorNotificationFromResponse(err));
      }
    }

    setLoading(false);
  };

  if (!state.visibility) {
    return false;
  }

  return (
    <Popup onClickClose={() => dispatch(authActions.hidePopup())}>
      <Content
        fixWidth={false}
        onClickClose={() => dispatch(authActions.hidePopup())}
      >
        <form
          noValidate
          className={styles.auth}
          onSubmit={(e) => {
            e.preventDefault();
            submit(data);
          }}
        >
          <div className={styles.title}>
            Welcome back!
          </div>

          <div className={styles.content}>
            <div className={styles.field}>
              <TextInput
                autoFocus
                ymDisableKeys
                maxLength={USER_ACCOUNT_LENGTH}
                label="Account name"
                submited={submited}
                value={data.accountName}
                error={errors && errors.accountName}
                onChange={(accountName) => {
                  setDataAndValidate({ ...data, accountName });
                }}
              />
            </div>
            <div className={styles.field}>
              <TextInput
                ymDisableKeys
                type="password"
                label="Brainkey"
                submited={submited}
                value={data.brainkey}
                error={errors && errors.brainkey}
                onChange={(value) => {
                  const brainkey = removeMultipleSpaces(value);
                  setDataAndValidate({ ...data, brainkey });
                }}
              />
            </div>

            <div className={styles.action}>
              <Button
                red
                big
                cap
                strech
                type="submit"
                disabled={loading}
              >
                Log in
              </Button>
            </div>
          </div>

          <div className={styles.footer}>
            No account?&nbsp;
            <Link
              className="link red"
              to={{
                pathname: urls.getRegistrationUrl(),
                state: { prevPath: location.pathname || null },
              }}
            >
              Create one
            </Link>
          </div>
        </form>
      </Content>
    </Popup>
  );
};

export default withRouter(LoginSimple);
