import { useTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import React from 'react';
import RegistrationBrainkeyStepFirst from './RegistrationBrainkeyStepFirst';
import RegistrationBrainkeyStepSecond from './RegistrationBrainkeyStepSecond';
import RegistrationBrainkeyStepThird from './RegistrationBrainkeyStepThird';
import {
  SECOND_STEP_ID,
  FIRST_BRAINKEY_STEP_ID,
  SECOND_BRAINKEY_STEP_ID,
  THIRD_BRAINKEY_STEP_ID,
} from '../../store/registration';

const RegistrationStepSecond = (props) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        'registration__section',
        'registration__section_second',
        { 'registration__section_active': props.registration.activeStepId === SECOND_STEP_ID },
      )}
    >
      <div className="registration__title">
        <div className="registration__step">2/3</div>
        <h3 className="title title_small">{t('Brainkey')}</h3>
      </div>

      <div className="registration__content">
        {(() => {
          switch (props.registration.activeBrainkeyStepId) {
            case (FIRST_BRAINKEY_STEP_ID):
              return <RegistrationBrainkeyStepFirst />;
            case (SECOND_BRAINKEY_STEP_ID):
              return <RegistrationBrainkeyStepSecond />;
            case (THIRD_BRAINKEY_STEP_ID):
              return <RegistrationBrainkeyStepThird />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
  }, dispatch),
)(RegistrationStepSecond);
