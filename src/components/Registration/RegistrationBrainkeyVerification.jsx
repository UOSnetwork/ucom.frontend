import { withTranslation, Trans } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { random } from 'lodash';
import React, { PureComponent, Fragment } from 'react';
import TextInput from '../TextInput';
import { SECOND_STEP_ID, FIRST_BRAINKEY_STEP_ID } from '../../store/registration';
import { registrationSetStep, registrationSetBrainkeyStep } from '../../actions/registration';

class RegistrationBrainkeyVerification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      verificationWordsIndexes: [random(0, 5), random(6, 11)],
      verificationWords: ['', ''],
    };
  }

  componentWillReceiveProps(props) {
    if (props.brainkey !== this.props.brainkey) {
      this.setState(this.getInitialState());
    }
  }

  getVerificationWord(index) {
    const arrayIndex = this.state.verificationWordsIndexes.indexOf(index);

    return this.state.verificationWords[arrayIndex];
  }

  setVerificationWord(index, word) {
    const arrayIndex = this.state.verificationWordsIndexes.indexOf(index);
    const verificationWords = [].concat(this.state.verificationWords);

    verificationWords[arrayIndex] = word;
    this.setState({ verificationWords }, () => this.validate());
  }

  validate() {
    const isComplete = this.state.verificationWords.every(i => i.length > 0);
    const isValid = this.state.verificationWordsIndexes
      .map((index, i) => (
        this.props.brainkey.split(' ')[index] === this.state.verificationWords[i]
      ))
      .every(i => Boolean(i));

    this.props.onComplete(isComplete);
    this.props.onChange(isValid);
  }

  render() {
    return (
      <Fragment>
        <div className="registration__text">
          <div className="text">
            <p>
              {this.props.t('typeWordsBrainkey', { num1: this.state.verificationWordsIndexes[0] + 1, num2: this.state.verificationWordsIndexes[1] + 1 })}<br />
              <Trans i18nKey="If you didnt save your Brainkey">
                If you didn&apos;t save your Brainkey,&nbsp;
                <span className="registration__link">
                  <button
                    className="button-clean button-clean_link"
                    onClick={() => {
                      this.props.registrationSetStep(SECOND_STEP_ID);
                      this.props.registrationSetBrainkeyStep(FIRST_BRAINKEY_STEP_ID);
                    }}
                  >
                    generate a new one
                  </button>
                </span>.
              </Trans>
            </p>
          </div>
        </div>

        <div className="registration-brainkey-verification">
          <div className="registration-brainkey">
            {this.props.brainkey.split(' ').map((item, index) => (
              <Fragment key={index}>
                {this.state.verificationWordsIndexes.indexOf(index) > -1 ? (
                  <div className="registration-brainkey__item registration-brainkey__item_input">
                    <TextInput
                      ymDisableKeys
                      placeholder={`word ${index + 1}`}
                      value={this.getVerificationWord(index)}
                      onChange={value => this.setVerificationWord(index, value)}
                    />
                  </div>
                ) : (
                  <div className="registration-brainkey__item" data-index={index + 1}>{item}&nbsp;</div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  null,
  dispatch => bindActionCreators({
    registrationSetStep,
    registrationSetBrainkeyStep,
  }, dispatch),
)(withTranslation()(RegistrationBrainkeyVerification));
