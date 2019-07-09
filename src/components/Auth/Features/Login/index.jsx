import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Popup, { Content } from '../../../Popup';
import Account from './Account';
import SocialKey from './SocialKey';
import GenerateSocialKey from './GenerateSocialKey';
import SaveSocialKey from './SaveSocialKey';
import { fetchUser } from '../../../../actions/users';
import loader from '../../../../utils/loader';
import { getUserById } from '../../../../store/users';
import urls from '../../../../utils/urls';
import { getUserName } from '../../../../utils/user';
import * as authActions from '../../../../actions/auth';

const STEP_ACCOUNT = 1;
const STEP_SOCIAL_KEY = 2;
const STEP_NEW_SOCIAL_KEY = 3;
const STEP_SAVE_SOCIAL_KEY = 4;

const ERROR_ACCOUNT_NOT_EXIST = 'Such account does not exist in a blockchain';

const Auth = (props) => {
  if (!props.visibility) {
    return null;
  }

  const [currentStep, setCurrentStep] = useState(STEP_ACCOUNT);
  const [loading, setLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [userId, setUserId] = useState(null);
  const [socialKey, setSocialKey] = useState(null);
  const user = getUserById(props.users, userId);

  return (
    <Popup onClickClose={() => props.dispatch(authActions.hidePopup())}>
      <Content
        fullHeight
        onClickClose={() => props.dispatch(authActions.hidePopup())}
      >
        {(() => {
          switch (currentStep) {
            case STEP_SOCIAL_KEY: {
              if (!user) {
                setCurrentStep(STEP_ACCOUNT);
                return null;
              }

              return (
                <SocialKey
                  userName={getUserName(user)}
                  userAccountName={user.accountName}
                  userAvatarSrc={urls.getFileUrl(user.avatarFilename)}
                  onClickBack={() => setCurrentStep(STEP_ACCOUNT)}
                  onClickNewKeys={() => setCurrentStep(STEP_NEW_SOCIAL_KEY)}
                />
              );
            }
            case STEP_NEW_SOCIAL_KEY:
              return (
                <GenerateSocialKey
                  onClickBack={() => setCurrentStep(STEP_SOCIAL_KEY)}
                  onSubmit={(socialKey) => {
                    setSocialKey(socialKey);
                    setCurrentStep(STEP_SAVE_SOCIAL_KEY);
                  }}
                />
              );
            case STEP_SAVE_SOCIAL_KEY:
              return (
                <SaveSocialKey
                  socialKey={socialKey}
                  onClickBack={() => setCurrentStep(STEP_SOCIAL_KEY)}
                />
              );
            default:
              return (
                <Account
                  loading={loading}
                  error={accountError}
                  onChange={() => {
                    setAccountError('');
                  }}
                  onSubmit={async (accountName) => {
                    setLoading(true);
                    loader.start();
                    try {
                      const userData = await props.dispatch(fetchUser(accountName));
                      setAccountError('');
                      setUserId(userData.id);
                      setCurrentStep(STEP_SOCIAL_KEY);
                    } catch (e) {
                      setAccountError(ERROR_ACCOUNT_NOT_EXIST);
                    }
                    setLoading(false);
                    loader.done();
                  }}
                />
              );
          }
        })()}
      </Content>
    </Popup>
  );
};

Auth.propTypes = {
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  visibility: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

Auth.defaultProps = {
  visibility: false,
};

export default connect(state => ({
  users: state.users,
  visibility: state.auth.visibility,
}))(Auth);
