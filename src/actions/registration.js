import Validator from '../utils/validator';
import api from '../api';
import { generateBrainkey } from '../utils/brainkey';
import { saveToken } from '../utils/token';
import urls from '../utils/urls';
import { saveActiveKey, getActivePrivateKey } from '../utils/keys';
import { getPostUrl } from '../utils/posts';

const { EventsIds } = require('ucom.libs.common').Events.Dictionary;
const { SocialApi } = require('ucom-libs-wallet');

export const registrationReset = payload => ({ type: 'REGISTRATION_RESET', payload });
export const registrationSetStep = payload => ({ type: 'REGISTRATION_SET_STEP', payload });
export const registrationSetAccountName = payload => ({ type: 'REGISTRATION_SET_ACCOUNT_NAME', payload });
export const registrationSetAccountNameError = payload => ({ type: 'REGISTRATION_SET_ACCOUNT_NAME_ERROR', payload });
export const registrationSetAccountNameIsValid = payload => ({ type: 'REGISTRATION_SET_ACCOUNT_NAME_IS_VALID', payload });
export const registrationSetBrainkeyStep = payload => ({ type: 'REGISTRATION_SET_BRAINKEY_STEP', payload });
export const registrationSetBrainkey = payload => ({ type: 'REGISTRATION_SET_BRAINKEY', payload });
export const registrationSetLoading = payload => ({ type: 'REGISTRATION_SET_LOADING', payload });
export const registrationSetIsTrackingAllowed = payload => ({ type: 'REGISTRATION_SET_IS_TRACKING_ALLOWED', payload });

export const registrationValidateAccountName = () => (dispatch, getState) => {
  const state = getState();
  const { accountName } = state.registration;
  const validator = new Validator({
    accountName,
  }, {
    accountName: ['required', 'regex:/^[a-z1-5]{12}$/', 'accountname'],
  });

  validator.setAttributeNames({ accountName: 'account name' });

  validator.checkAsync(() => {
    dispatch(registrationSetAccountNameError(null));
    dispatch(registrationSetAccountNameIsValid(true));
  }, () => {
    const error = validator.errors.first('accountName');
    dispatch(registrationSetAccountNameError(error));
    dispatch(registrationSetAccountNameIsValid(false));
  });
};

export const registrationSetAndValidateAccountName = payload => (dispatch) => {
  dispatch(registrationSetAccountName(payload));
  dispatch(registrationValidateAccountName(payload));
};

export const registrationGenerateBrainkey = () => (dispatch) => {
  dispatch(registrationSetBrainkey(generateBrainkey()));
};

export const registrationRegister = prevPage => async (dispatch, getState) => {
  const state = getState();
  const { brainkey, accountName, isTrackingAllowed } = state.registration;
  const activePrivateKey = getActivePrivateKey(brainkey);

  dispatch(registrationSetLoading(true));

  setTimeout(async () => {
    let referralData;
    let registrationData;

    try {
      referralData = await api.getReferralState(EventsIds.registration());
    } catch (err) {
      console.error(err);
    }

    try {
      registrationData = await api.register({
        brainkey,
        accountName,
        isTrackingAllowed,
      });
      saveToken(registrationData.token);
      saveActiveKey(activePrivateKey);
    } catch (e) {
      console.error(e);
    }

    if (
      referralData &&
      referralData.affiliatesActions &&
      referralData.affiliatesActions[0] &&
      referralData.affiliatesActions[0].accountNameSource &&
      referralData.affiliatesActions[0].offerId &&
      referralData.affiliatesActions[0].action
    ) {
      try {
        const signedTransaction = await SocialApi.getReferralFromUserSignedTransactionAsJson(
          accountName,
          activePrivateKey,
          referralData.affiliatesActions[0].accountNameSource,
        );

        await api.referralTransaction({
          signedTransaction,
          accountNameSource: referralData.affiliatesActions[0].accountNameSource,
          offerId: referralData.affiliatesActions[0].offerId,
          action: referralData.affiliatesActions[0].action,
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (prevPage !== undefined && prevPage !== null && !Number.isNaN(prevPage)) {
      window.location.replace(getPostUrl(prevPage));
    } else {
      window.location.replace(urls.getUserUrl(registrationData.user.id));
    }
  }, 10);
};
