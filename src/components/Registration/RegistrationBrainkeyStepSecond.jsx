import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import crypto from 'crypto';
import { range, throttle } from 'lodash';
import React, { Fragment, PureComponent } from 'react';
import { registrationGenerateBrainkey, registrationSetBrainkeyStep } from '../../actions/registration';
import { THIRD_BRAINKEY_STEP_ID } from '../../store/registration';

class RegistrationBrainkeyStepSecond extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      bytes: range(0, 12).map(() => '00'),
      progress: 0,
    };

    this.eventName = 'ontouchstart' in window ? 'touchmove' : 'mousemove';
  }

  componentDidMount() {
    document.addEventListener(this.eventName, this.generateBytes);
  }

  componentWillUnmount() {
    document.removeEventListener(this.eventName, this.generateBytes);
  }

  generateBytes = throttle(() => {
    const bytes = [].concat(this.state.bytes);
    const byte = crypto.randomBytes(1);
    const progress = this.state.progress + 1;

    let index;

    do {
      index = Math.floor(Math.random() * 12);
    } while (this.state.bytes[index] !== '00');

    bytes[index] = byte.toString('hex');

    this.setState({ bytes, progress });

    if (progress === 12) {
      document.removeEventListener(this.eventName, this.generateBytes);
      setTimeout(() => {
        this.props.registrationGenerateBrainkey();
        this.props.registrationSetBrainkeyStep(THIRD_BRAINKEY_STEP_ID);
      }, 500);
    }
  }, 200)

  render() {
    return (
      <Fragment>
        <div className="registration__text">
          <div className="text">
            <p>Always keep your Brainkey secure. Never lose it.</p>
          </div>
        </div>

        <div className="registration-brainkey-generate">
          <div className="registration-brainkey-generate__title">
            Move your pointer to generate the Brainkey
          </div>

          <div
            style={{ width: `${(100 / 12) * this.state.progress}%` }}
            className="registration-brainkey-generate__progress"
          />

          <div className="registration-brainkey-generate__bytes">
            {this.state.bytes.map((item, index) => (
              <div
                key={index}
                className={classNames(
                  'registration-brainkey-generate__byte',
                  { 'registration-brainkey-generate__byte_active': item !== '00' },
                )}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    registration: state.registration,
  }),
  dispatch => bindActionCreators({
    registrationGenerateBrainkey,
    registrationSetBrainkeyStep,
  }, dispatch),
)(RegistrationBrainkeyStepSecond);
