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
          <p>{t('The Brainkey is the seed phrase from which your public-private key pairs are generated. You can restore the public-private key pairs from your Brainkey if you lose the keys.')}</p>
          <p><strong>{t('The Brainkey itself cannot be restored once lost!')}</strong></p>
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
