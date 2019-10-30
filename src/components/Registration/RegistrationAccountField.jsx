import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import InputErrorIcon from '../Icons/InputError';
import InputCompleteIcon from '../Icons/InputComplete';
import { registrationSetAndValidateAccountName } from '../../actions/registration';

const RegistrationAccountField = (props) => {
  const { t } = useTranslation();
  const accountNameLength = props.registration.accountName.length;

  return (
    <div className="registration-account-field">
      <div className="registration-account-field__label">{t('Account name')}</div>
      <div className="registration-account-field__input">
        <span className="registration-account-field__sign">@</span>

        <input
          type="text"
          className="registration-account-field__data"
          placeholder="helloworld12"
          minLength="12"
          maxLength="12"
          value={props.registration.accountName}
          onChange={e => props.registrationSetAndValidateAccountName(e.target.value)}
        />

        <span className="registration-account-field__counter">{`${accountNameLength} / 12`}</span>

        <span
          className={classNames(
            'registration-account-field__progress',
            { 'registration-account-field__progress_success': Boolean(props.registration.accountNameIsValid) },
            { 'registration-account-field__progress_full': accountNameLength === 12 },
          )}
          style={{ width: `${(100 * accountNameLength) / 12}%` }}
        />
      </div>

      {props.registration.accountNameError &&
        <div className="registration-account-field__hint">
          <span className="inline inline_small">
            <span className="inline__item">
              <InputErrorIcon />
            </span>
            <span className="inline__item">
              {props.registration.accountNameError}
            </span>
          </span>
        </div>
      }

      {props.registration.accountNameIsValid &&
        <div className="registration-account-field__hint">
          <span className="inline inline_small">
            <span className="inline__item">
              <InputCompleteIcon />
            </span>
            <span className="inline__item">
              {t('niceName')}
            </span>
          </span>
        </div>
      }
    </div>
  );
};

export default connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
    registrationSetAndValidateAccountName,
  }, dispatch),
)(RegistrationAccountField);
