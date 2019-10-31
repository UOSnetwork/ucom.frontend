import { useTranslation, Trans } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import Button from '../Button';
import RegistrationAccountField from './RegistrationAccountField';
import { FIRST_STEP_ID, SECOND_STEP_ID } from '../../store/registration';
import { registrationSetStep } from '../../actions/registration';

const RegistrationStepFirst = (props) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        'registration__section',
        'registration__section_first',
        { 'registration__section_active': props.registration.activeStepId === FIRST_STEP_ID },
      )}
    >
      <div className="registration__title">
        <div className="registration__step">1/3</div>
        <h3 className="title title_small">
          {props.registration.activeStepId === FIRST_STEP_ID ? (
            <Fragment>{t('Choose Account Name')}</Fragment>
          ) : (
            <Fragment>{t('registration.accountName', { accountName: props.registration.accountName })}</Fragment>
          )}
        </h3>
      </div>

      <div className="registration__content">
        <div className="registration-account-info">
          <div className="registration-account-info__section">
            <div className="registration-account-info__title">12</div>
            <div className="registration-account-info__description">
              <Trans i18nKey="Must be 12 characters">
                Must be <strong>12 characters</strong>
              </Trans>
            </div>
          </div>

          <div className="registration-account-info__section">
            <div className="registration-account-info__title">a <strike><span>A</span></strike></div>
            <div className="registration-account-info__description">
              <Trans i18nKey="Must be lowercase only">
                Must be <strong>lowercase</strong> only
              </Trans>
            </div>
          </div>

          <div className="registration-account-info__section">
            <div className="registration-account-info__title">1-5</div>
            <div className="registration-account-info__description">
              <Trans i18nKey="сanOnlyNumbers'">
                Can only have <strong>numbers 1–5</strong>
              </Trans>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.registrationSetStep(SECOND_STEP_ID);
          }}
        >
          <RegistrationAccountField />

          <div className="registration__action">
            <Button
              isStretched
              isUpper
              isDisabled={!props.registration.accountNameIsValid}
              size="big"
              theme="red"
              type="submit"
              text={t('Proceed')}
              // onClick={() => props.registrationSetStep(SECOND_STEP_ID)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
    registrationSetStep,
  }, dispatch),
)(RegistrationStepFirst);
