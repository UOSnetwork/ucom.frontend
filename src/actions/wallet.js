import humps from 'lodash-humps';
import { WalletApi } from 'ucom-libs-wallet';
import Worker from '../worker';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils';
import api from '../api';
import { getOwnerCredentialsOrShowAuthPopup } from './users';
import { addErrorNotificationFromResponse, addSuccessNotification } from './notifications';
import Command from '../utils/command';

export const setData = payload => ({ type: 'WALLET_SET_DATA', payload });

export const reset = payload => ({ type: 'WALLET_RESET', payload });

export const toggle = visible => dispatch =>
  dispatch(setData({ visible }));

export const walletToggleBuyRam = buyRamVisible => dispatch =>
  dispatch(setData({ buyRamVisible }));

export const walletToggleSellRam = sellRamVisible => dispatch =>
  dispatch(setData({ sellRamVisible }));

export const walletToggleEditStake = editStakeVisible => dispatch =>
  dispatch(setData({ editStakeVisible }));

export const walletToggleSendTokens = sendTokensVisibility => dispatch =>
  dispatch(setData({ sendTokensVisibility }));

export const walletBuyRam = (accountName, amount, privateKey) => () =>
  Worker.buyRam(accountName, privateKey, amount);

export const walletSellRam = (accountName, amount, privateKey) => () =>
  Worker.sellRam(accountName, privateKey, amount);

export const walletEditStake = (accountName, privateKey, netAmount, cpuAmount) => () =>
  Worker.stakeOrUnstakeTokens(accountName, privateKey, netAmount, cpuAmount);

export const walletSendTokens = (accountNameFrom, accountNameTo, amount, memo, privateKey) => () =>
  Worker.sendTokens(accountNameFrom, privateKey, accountNameTo, amount, memo);

export const walletGetAccount = accountName => async (dispatch) => {
  const data = await WalletApi.getAccountState(accountName);

  data.tokens.uosFutures = await WalletApi.getAccountBalance(accountName, 'UOSF');

  dispatch(setData({ ...humps(data) }));
};

export const getTransactions = (page, perPage, append = false) => async (dispatch, getState) => {
  const transactions = await api.getTransactions(page, perPage);
  const { wallet } = getState();

  if (append) {
    transactions.data = wallet.transactions.data.concat(transactions.data);
  }

  dispatch(setData({ transactions }));
};

export const getEmissionAndShowNotification = () => async (dispatch) => {
  try {
    const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

    if (!ownerCredentials) {
      return;
    }

    await Worker.claimEmission(ownerCredentials.accountName, ownerCredentials.socialKey, TRANSACTION_PERMISSION_SOCIAL);
    await dispatch(walletGetAccount(ownerCredentials.accountName));
    dispatch(addSuccessNotification('Successfully get emission'));
  } catch (err) {
    dispatch(addErrorNotificationFromResponse(err));
  }
};

export const parseStrAndRunAction = str => (dispatch) => {
  if (Command.stringHasTipCommand(str)) {
    console.log(Command.parseTipCommand(str));
    dispatch(walletToggleSendTokens(true));
  }
};
