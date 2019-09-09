import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Popup, { Content } from '../../../Popup';
import Brainkey from '../../Screens/Brainkey';
import Key from '../../Screens/Key';
import Password from './Password';
import { getActivePrivateKey, saveAndEncryptActiveKey } from '../../../../utils/keys';
import { parseResponseError } from '../../../../utils/errors';
import withLoader from '../../../../utils/withLoader';
import { addSuccessNotification, addErrorNotification } from '../../../../actions/notifications';
import { checkBrainkey } from '../../../../actions/auth';

const STEP_BRAINKEY = 1;
const STEP_ACTIVE_KEY = 2;
const STEP_PASSWORD = 3;

const ChangePassword = (props) => {
  const [currentStep, setCurrentStep] = useState(STEP_BRAINKEY);
  const [brainkey, setBrainkey] = useState(null);
  const [brainkeyError, setBrainkeyError] = useState('');
  const [activeKeyValue, setActiveKeyValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <Popup onClickClose={props.onClickClose}>
      <Content
        fullHeight
        closeText={props.closeText}
        onClickClose={props.onClickClose}
      >
        {(() => {
          switch (currentStep) {
            case STEP_ACTIVE_KEY:
              return (
                <Key
                  onSubmit={(activeKey) => {
                    setActiveKeyValue(activeKey);
                    setCurrentStep(STEP_PASSWORD);
                  }}
                  onClickBack={() => {
                    setCurrentStep(STEP_BRAINKEY);
                  }}
                />
              );

            case STEP_PASSWORD:
              return (
                <Password
                  onSubmit={(password) => {
                    try {
                      let activeKey;
                      if (brainkey) {
                        activeKey = getActivePrivateKey(brainkey);
                      } else if (activeKeyValue) {
                        activeKey = activeKeyValue;
                      } else {
                        setCurrentStep(STEP_BRAINKEY);
                        return;
                      }
                      saveAndEncryptActiveKey(activeKey, password);
                      props.onSubmit();
                      dispatch(addSuccessNotification('Password for Active Key has changed'));
                    } catch (e) {
                      dispatch(addErrorNotification(e.message));
                    }
                  }}
                />
              );

            default:
              return (
                <Brainkey
                  title="Generate Private Active Key with Brainkey"
                  description={props.description}
                  error={brainkeyError}
                  loading={loading}
                  backText="I have Active Private key"
                  onChange={() => {
                    setBrainkeyError('');
                  }}
                  onSubmit={async (brainkey) => {
                    setLoading(true);
                    try {
                      await withLoader(dispatch(checkBrainkey(brainkey)));
                      setBrainkey(brainkey);
                      setCurrentStep(STEP_PASSWORD);
                    } catch (err) {
                      console.dir(err);
                      const { message } = parseResponseError(err)[0];
                      setBrainkeyError(message);
                    }
                    setLoading(false);
                  }}
                  onClickBack={() => {
                    setCurrentStep(STEP_ACTIVE_KEY);
                  }}
                />
              );
          }
        })()}
      </Content>
    </Popup>
  );
};

ChangePassword.propTypes = {
  onClickClose: PropTypes.func.isRequired,
  description: Brainkey.propTypes.description,
  closeText: PropTypes.string,
};

ChangePassword.defaultProps = {
  description: Brainkey.defaultProps.description,
  closeText: undefined,
};

export default ChangePassword;
