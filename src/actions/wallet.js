import humps from 'lodash-humps';
import { WalletApi } from 'ucom-libs-wallet';
import Worker from '../worker';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';
import api from '../api';

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

export const walletGetEmission = (accountName, privateKey) => () =>
  Worker.claimEmission(accountName, privateKey, TRANSACTION_PERMISSION_SOCIAL);

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
