import { useTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Fragment } from 'react';
import Button from '../Button';
import { registrationSetBrainkeyStep } from '../../actions/registration';
import { SECOND_BRAINKEY_STEP_ID } from '../../store/registration';

const RegistrationBrainkeyStepFirst = (props) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className="registration__text">
        <div className="text">
          <p>{t('brainkeySeed')}</p>
          <p><strong>{t('brainkeyItself')}</strong></p>
        </div>
      </div>

      <div className="registration__action">
        <Button
          isStretched
          isUpper
          size="big"
          theme="red"
          type="submit"
          text="Generate"
          onClick={() => props.registrationSetBrainkeyStep(SECOND_BRAINKEY_STEP_ID)}
        />
      </div>
    </Fragment>
  );
};

export default connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
    registrationSetBrainkeyStep,
  }, dispatch),
)(RegistrationBrainkeyStepFirst);
