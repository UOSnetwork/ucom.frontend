import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import Button from '../Button';
import Checkbox from '../Checkbox';
import RegistrationBrainkeyVerification from './RegistrationBrainkeyVerification';
import { THIRD_STEP_ID } from '../../store/registration';
import { registrationRegister, registrationSetIsTrackingAllowed } from '../../actions/registration';
import { getAirdropOfferId } from '../../utils/airdrop';
import { getGrecaptchaSitekey } from '../../utils/config';

const offerId = getAirdropOfferId();

class RegistrationStepThird extends PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      brainkeyVerificationIsComplete: false,
      brainkeyVerificationIsValid: false,
      termsAccepted: false,
      recaptchaValid: false,
    };
  }

  componentDidMount() {
    grecaptcha.ready(() => {
      grecaptcha.render('recaptcha', {
        sitekey: getGrecaptchaSitekey(),
        callback: () => {
          this.setState({
            recaptchaValid: true,
          });
        },
      });
    });
  }

  componentWillReceiveProps(props) {
    if (props.registration.brainkey !== this.props.registration.brainkey) {
      this.setState(this.getInitialState());
    }
  }

  getPrevPageId() {
    let prevPageId;
    const prevPath = this.props.prevPath !== null ? this.props.prevPath.match(/\d+/) : null;
    if (prevPath !== null && +prevPath[0] === offerId) {
      prevPageId = offerId;
    } else {
      prevPageId = null;
    }

    return prevPageId;
  }

  render() {
    return (
      <div
        className={classNames(
          'registration__section',
          'registration__section_third',
          { 'registration__section_active': this.props.registration.activeStepId === THIRD_STEP_ID },
        )}
      >

        <div className="registration__title">
          <div className="registration__step">3/3</div>
          <h3 className="title title_small">Verification</h3>
        </div>

        <div className="registration__content">
          <RegistrationBrainkeyVerification
            brainkey={this.props.registration.brainkey}
            onChange={isValid => this.setState({ brainkeyVerificationIsValid: isValid })}
            onComplete={isComplete => this.setState({ brainkeyVerificationIsComplete: isComplete })}
          />

          <div id="recaptcha" />

          <div className="registration-terms">
            <div className="registration-terms__item">
              <span className="toolbar">
                <span className="toolbar__side">
                  <Checkbox
                    isChecked={this.state.termsAccepted}
                    onChange={checked => this.setState({ termsAccepted: checked })}
                  />
                </span>
                <span className="toolbar__main">I accept the  General <a target="_blank" rel="noopener noreferrer" className="registration__link" href="/posts/7881">Terms and Conditions.</a></span>
              </span>
            </div>
            <div className="registration-terms__item">
              <span className="toolbar">
                <span className="toolbar__side">
                  <Checkbox
                    isChecked={this.props.registration.isTrackingAllowed}
                    onChange={checked => this.props.registrationSetIsTrackingAllowed(checked)}
                  />
                </span>
                <span className="toolbar__main">Allow to send anonymous usage data for developer.</span>
              </span>
            </div>
          </div>

          <div className="registration-footer">
            <div className="registration-footer__action">
              <Button
                isStretched
                isUpper
                size="big"
                theme="red"
                type="submit"
                text="Finish"
                isDisabled={this.props.registration.loading || !this.state.brainkeyVerificationIsValid || !this.state.termsAccepted || !this.state.recaptchaValid}
                onClick={() => this.props.registrationRegister(this.getPrevPageId() || null)}
              />
            </div>
            {this.state.brainkeyVerificationIsComplete && !this.state.brainkeyVerificationIsValid &&
              <div className="registration-footer__error">
                Selected keywords don&apos;t match with entered on previous step.<br />Try check the order of your phrase.
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
    registrationRegister,
    registrationSetIsTrackingAllowed,
  }, dispatch),
)(RegistrationStepThird));
