import moment from 'moment';
import Validator from '../utils/validator';
import api from '../api';
import { generateBrainkey } from '../utils/brainkey';
import { saveToken } from '../utils/token';
import urls from '../utils/urls';
import { saveSocialKey } from '../utils/keys';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';
import { followUserByAccountName, followUosOrg } from '../actions/follow';
import Worker from '../worker';

const { EventsIds } = require('ucom.libs.common').Events.Dictionary;

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

  const activeKey = await Worker.getActiveKeyByBrainKey(brainkey);
  const socialKey = await Worker.getSocialKeyByActiveKey(activeKey);

  dispatch(registrationSetLoading(true));

  let referralData;
  let registrationData;

  try {
    referralData = await api.getReferralState(EventsIds.registration());
  } catch (err) {
    console.error(err);
  }

  try {
    registrationData = await api.register(brainkey, accountName, isTrackingAllowed);
  } catch (err) {
    console.error(err);
    dispatch(registrationSetLoading(false));
    throw err;
  }

  try {
    saveToken(registrationData.token);
    saveSocialKey(socialKey);
  } catch (err) {
    console.error(err);
  }

  try {
    const userCreatedAt = moment().utc().format();
    const signedTransaction = await Worker.createProfileAfterRegistration(accountName, activeKey, isTrackingAllowed, userCreatedAt);
    const signedTransactionAsJson = JSON.stringify(signedTransaction);

    await api.registrationProfile(signedTransactionAsJson, userCreatedAt);
  } catch (err) {
    console.error(err);
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
      await Promise.all([
        Worker.getReferralFromUserSignedTransactionAsJson(
          accountName,
          socialKey,
          referralData.affiliatesActions[0].accountNameSource,
          TRANSACTION_PERMISSION_SOCIAL,
        ).then(signedTransaction => api.referralTransaction(
          signedTransaction,
          referralData.affiliatesActions[0].accountNameSource,
          referralData.affiliatesActions[0].offerId,
          referralData.affiliatesActions[0].action,
        )),
        dispatch(followUserByAccountName(
          accountName,
          referralData.affiliatesActions[0].accountNameSource,
          socialKey,
        )),
        dispatch(followUosOrg(accountName, socialKey)),
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  if (prevPage !== undefined && prevPage !== null && !Number.isNaN(prevPage)) {
    window.location.replace(urls.getPublicationUrl(prevPage));
  } else if (registrationData && registrationData.user && registrationData.user.id) {
    window.location.replace(urls.getUserEditProfileUrl(registrationData.user.id));
  } else {
    window.location.replace(urls.getMainPageUrl());
  }
};
