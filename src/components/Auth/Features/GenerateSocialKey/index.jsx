import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Popup, { Content } from '../../../Popup';
import Brainkey from '../../Screens/Brainkey';
import Key from '../../Screens/Key';
import SaveKey from '../../Screens/SaveKey';
import { addErrorNotification } from '../../../../actions/notifications';
import Worker from '../../../../worker';

const STEP_BRAINKEY = 1;
const STEP_ACTIVE_KEY = 2;
const STEP_SAVE_KEY = 3;

const GenerateSocialKey = (props) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(STEP_BRAINKEY);
  const [socialKey, setSocailKey] = useState(null);
  const [loading, setLoading] = useState(false);

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
                  loading={loading}
                  onSubmit={async (activeKey) => {
                    setLoading(true);

                    try {
                      const socialKey = await Worker.getSocialKeyByActiveKey(activeKey);
                      setSocailKey(socialKey);
                      setCurrentStep(STEP_SAVE_KEY);
                    } catch (err) {
                      props.dispatch(addErrorNotification(err.message));
                    }

                    setLoading(false);
                  }}
                  onClickBack={() => {
                    setSocailKey(null);
                    setCurrentStep(STEP_BRAINKEY);
                  }}
                />
              );

            case STEP_SAVE_KEY:
              return (
                <SaveKey
                  title={t('auth.saveSocial')}
                  copyText={socialKey}
                  proceedAsLink={false}
                  proceedText={t('Finish')}
                  onClickProceed={() => {
                    props.onSubmit(socialKey);
                  }}
                />
              );

            default:
              return (
                <Brainkey
                  loading={loading}
                  title={t('auth.generateSocialKey')}
                  backText={t('auth.havePrivateActive')}
                  onSubmit={async (brainkey) => {
                    setLoading(true);

                    try {
                      const activeKey = await Worker.getActiveKeyByBrainKey(brainkey);
                      const socialKey = await Worker.getSocialKeyByActiveKey(activeKey);

                      setSocailKey(socialKey);
                      setCurrentStep(STEP_SAVE_KEY);
                    } catch (e) {
                      props.dispatch(addErrorNotification(e.message));
                    }

                    setLoading(false);
                  }}
                  onClickBack={() => {
                    setSocailKey(null);
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

GenerateSocialKey.propTypes = {
  onClickClose: PropTypes.func.isRequired,
  closeText: PropTypes.string,
};

GenerateSocialKey.defaultProps = {
  closeText: undefined,
};

export default connect()(GenerateSocialKey);
