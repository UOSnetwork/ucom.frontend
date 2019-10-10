import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, memo, useEffect } from 'react';
import Popup, { Content } from '../../../Popup';
import Account from './Account';
import SocialKey from './SocialKey';
import GenerateSocialKeyByBrainkey from './GenerateSocialKeyByBrainkey';
import GenerateSocialKeyByActiveKey from './GenerateSocialKeyByActiveKey';
import SaveSocialKey from './SaveSocialKey';
import { fetchUser } from '../../../../actions/users';
import withLoader from '../../../../utils/withLoader';
import { selectUserById } from '../../../../store/selectors';
import urls from '../../../../utils/urls';
import { getUserName } from '../../../../utils/user';
import * as authActions from '../../../../actions/auth';
import { parseResponseError } from '../../../../utils/errors';
import { scatter } from '../../../../utils/Scatter';
import { PERMISSION_SOCIAL } from '../../../../utils/constants';

const STEP_ACCOUNT = 1;
const STEP_SOCIAL_KEY = 2;
const STEP_NEW_SOCIAL_KEY_BY_BRAINKEY = 3;
const STEP_NEW_SOCIAL_KEY_BY_ACTIVE_KEY = 5;
const STEP_SAVE_SOCIAL_KEY = 4;
const ERROR_ACCOUNT_NOT_EXIST = 'Such account does not exist in a blockchain';

const Auth = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(STEP_ACCOUNT);
  const [loading, setLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [socialKeyError, setSocialKeyError] = useState('');
  const [userId, setUserId] = useState(null);
  const [socialKey, setSocialKey] = useState(null);
  const user = useSelector(selectUserById(userId), isEqual);

  const scatterLogin = async () => {
    try {
      const account = await scatter.loginByAuthority(PERMISSION_SOCIAL);
      const sign = await scatter.sign(account.publicKey, account.name);
      await dispatch(authActions.loginByScatter(account.name, account.publicKey, sign));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (scatter.isConnected()) {
      scatterLogin();
    }
  }, []);

  return (
    <Popup onClickClose={() => dispatch(authActions.hidePopup())}>
      <Content
        fullHeight
        onClickClose={() => dispatch(authActions.hidePopup())}
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
                  loading={loading}
                  error={socialKeyError}
                  userName={getUserName(user)}
                  userAccountName={user.accountName}
                  userAvatarSrc={urls.getFileUrl(user.avatarFilename)}
                  onClickBack={() => setCurrentStep(STEP_ACCOUNT)}
                  onClickNewKeys={() => setCurrentStep(STEP_NEW_SOCIAL_KEY_BY_BRAINKEY)}
                  onChange={() => {
                    setSocialKeyError('');
                  }}
                  onSubmit={async (socialKey) => {
                    setLoading(true);
                    try {
                      await withLoader(dispatch(authActions.loginBySocialKey(socialKey, user.accountName)));
                    } catch (err) {
                      const errors = parseResponseError(err);
                      setSocialKeyError(errors[0].message);
                      setLoading(false);
                    }
                  }}
                />
              );
            }
            case STEP_NEW_SOCIAL_KEY_BY_BRAINKEY:
              return (
                <GenerateSocialKeyByBrainkey
                  accountName={user.accountName}
                  onClickBack={() => setCurrentStep(STEP_SOCIAL_KEY)}
                  onClickActiveKey={() => setCurrentStep(STEP_NEW_SOCIAL_KEY_BY_ACTIVE_KEY)}
                  onSubmit={(socialKey) => {
                    setSocialKey(socialKey);
                    setCurrentStep(STEP_SAVE_SOCIAL_KEY);
                  }}
                />
              );
            case STEP_NEW_SOCIAL_KEY_BY_ACTIVE_KEY:
                return (
                  <GenerateSocialKeyByActiveKey
                    accountName={user.accountName}
                    onClickBack={() => setCurrentStep(STEP_SOCIAL_KEY)}
                    onClickBrainkey={() => setCurrentStep(STEP_NEW_SOCIAL_KEY_BY_BRAINKEY)}
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
                    try {
                      const userData = await withLoader(dispatch(fetchUser(accountName)));
                      setAccountError('');
                      setUserId(userData.id);
                      setCurrentStep(STEP_SOCIAL_KEY);
                    } catch (e) {
                      setAccountError(ERROR_ACCOUNT_NOT_EXIST);
                    }
                    setLoading(false);
                  }}
                />
              );
          }
        })()}
      </Content>
    </Popup>
  );
};

export default memo(Auth);
