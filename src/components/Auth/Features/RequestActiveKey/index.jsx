import PropTypes from 'prop-types';
import React, { useState, Fragment } from 'react';
import Popup, { Content } from '../../../Popup';
import PasswordSet from './PasswordSet';
import ActiveKey from './ActiveKey';
import Password from './Password';
import ChangePassword from '../ChangePassword';
import { encryptedActiveKeyIsExists } from '../../../../utils/keys';
import Scatter from '../../../../utils/Scatter';
import withLoader from '../../../../utils/withLoader';

const STEP_PASSWORD_SET = 1;
const STEP_PASSWORD = 2;
const STEP_ACTIVE_KEY = 3;
const STEP_PASSWORD_CREATE = 4;

const RequestActiveKey = (props) => {
  const [currentStep, setCurrentStep] = useState(null);
  const [visible, setVisible] = useState(false);
  const [submitArgs, setSubmitArgs] = useState([]);

  const resetStep = () => {
    if (encryptedActiveKeyIsExists()) {
      setCurrentStep(STEP_PASSWORD);
    } else {
      setCurrentStep(STEP_PASSWORD_SET);
    }
  };

  const show = (args) => {
    setSubmitArgs(args);
    resetStep();
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const submit = (activeKey) => {
    props.onSubmit.apply(null, [activeKey].concat(submitArgs));
  };

  const request = async (...args) => {
    if (!props.onScatterConnect) {
      show(args);
    }

    try {
      const scatter = await withLoader(Scatter.connect());
      await props.onScatterConnect.apply(null, [scatter, ...args]);
    } catch (err) {
      show(args);
    }
  };

  return (
    <Fragment>
      {(!props.replace || !visible) && props.children(request)}

      {visible && (() => {
        switch (currentStep) {
          case STEP_PASSWORD_CREATE:
            return (
              <ChangePassword
                description="To send this transaction, you need a Private Active Key. We generate it from your Brainkey."
                onClickClose={resetStep}
                onSubmit={resetStep}
              />
            );

          case STEP_PASSWORD_SET:
          case STEP_PASSWORD:
          case STEP_ACTIVE_KEY:
            return (
              <Popup onClickClose={hide}>
                <Content
                  walletAction
                  roundBorders={false}
                  onClickClose={hide}
                >
                  {(() => {
                    switch (currentStep) {
                      case STEP_PASSWORD:
                        return (
                          <Password
                            onClickActiveKey={() => setCurrentStep(STEP_ACTIVE_KEY)}
                            onSubmit={(activeKey) => {
                              submit(activeKey);
                              hide();
                            }}
                          />
                        );

                      case STEP_ACTIVE_KEY:
                        return (
                          <ActiveKey
                            onClickSetPassword={() => setCurrentStep(STEP_PASSWORD_CREATE)}
                            onSubmit={(activeKey) => {
                              submit(activeKey);
                              hide();
                            }}
                          />
                        );

                      case STEP_PASSWORD_SET:
                        return (
                          <PasswordSet
                            onSubmit={() => setCurrentStep(STEP_PASSWORD_CREATE)}
                            onClickActiveKey={() => setCurrentStep(STEP_ACTIVE_KEY)}
                          />
                        );

                      default:
                        return null;
                    }
                  })()}
                </Content>
              </Popup>
            );

          default:
            return null;
        }
      })()}
    </Fragment>
  );
};

RequestActiveKey.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onScatterConnect: PropTypes.func,
  replace: PropTypes.bool,
  children: PropTypes.func.isRequired,
};

RequestActiveKey.defaultProps = {
  replace: false,
  onScatterConnect: undefined,
};

export default RequestActiveKey;
