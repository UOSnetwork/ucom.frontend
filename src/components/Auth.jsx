// TODO: Remove this when social key feature is enabled

import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import { fetchMyself } from '../actions/users';
import { authSetVisibility, authLogin, authSetForm } from '../actions/auth';
import { getError, getValidationError } from '../utils/errors';
import TextInput from './TextInput';
import Button from './Button';
import Popup from './Popup';
import ModalContent from './ModalContent';
import urls from '../utils/urls';

const Auth = (props) => {
  if (!props.auth.visibility) {
    return null;
  }

  return (
    <Popup onClickClose={() => props.authSetVisibility(false)}>
      <ModalContent mod="auth" onClickClose={() => props.authSetVisibility(false)}>
        <div className="auth">
          <div className="auth__title">
            <h1 className="title">Welcome back!</h1>
          </div>

          <form
            noValidate
            className="auth__form ym-hide-content"
            onSubmit={(e) => {
              e.preventDefault();
              props.authLogin();
            }}
          >
            <div className="auth__fields">
              <div className="auth__field">
                <TextInput
                  touched
                  ymDisableKeys
                  maxLength="12"
                  label="Account name"
                  disabled={props.auth.loading}
                  value={props.auth.form.accountName}
                  onChange={accountName => props.authSetForm({ accountName })}
                  error={
                    getValidationError(props.auth.errors, 'accountName') ||
                    getError(props.auth.serverErrors, 'accountName')
                  }
                />
              </div>

              <div className="auth__field">
                <TextInput
                  touched
                  ymDisableKeys
                  label="Brainkey"
                  type="password"
                  disabled={props.auth.loading}
                  value={props.auth.form.brainkey}
                  onChange={brainkey => props.authSetForm({ brainkey })}
                  error={
                    getValidationError(props.auth.errors, 'brainkey') ||
                    getError(props.auth.serverErrors, 'brainkey')
                  }
                />
              </div>
            </div>

            <div className="auth__action">
              <Button
                isUpper
                isStretched
                size="big"
                theme="red"
                type="submit"
                isDisabled={props.auth.loading}
                text="Log in"
              />
            </div>

            <div className="auth__footer">
              <div className="inline inline_small">
                <span className="inline__item">No account?</span>
                <span className="inline__item">
                  <Link className="auth__link" to={{ pathname: urls.getRegistrationUrl(), state: { prevPath: props.location.pathname || null } }}>Create one</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </ModalContent>
    </Popup>
  );
};

export default withRouter(connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    fetchMyself,
    authLogin,
    authSetForm,
    authSetVisibility,
  }, dispatch),
)(Auth));
