import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import RegistrationStepIntro from './RegistrationStepIntro';
import RegistrationStepFirst from './RegistrationStepFirst';
import RegistrationStepSecond from './RegistrationStepSecond';
import RegistrationStepThird from './RegistrationStepThird';
import LayoutClean from '../Layout/LayoutClean';
import { registrationReset } from '../../actions/registration';
import Close from '../Close';

class Registration extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };
  }

  componentDidMount() {
    this.props.registrationReset();
  }

  render() {
    return (
      <LayoutClean>
        <div className="registration">
          <div className="registration__container">
            <div className="registration__close">
              <Close />
            </div>
            <div className="registration__inner">
              <div
                role="presentation"
                ref={(el) => { this.sectionsEl = el; }}
                className={classNames(
                  'registration__sections',
                  { 'registration__sections_active': this.state.active },
                )}
              >
                <RegistrationStepIntro />
                <RegistrationStepFirst />
                <RegistrationStepSecond />
                <RegistrationStepThird />
              </div>
            </div>
          </div>
        </div>
      </LayoutClean>
    );
  }
}

export default withRouter(connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
    registrationReset,
  }, dispatch),
)(Registration));
