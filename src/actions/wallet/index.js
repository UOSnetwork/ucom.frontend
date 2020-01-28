// TODO: Refactoring like sendTokens.js

import humps from 'lodash-humps';
import { WalletApi } from 'ucom-libs-wallet';
import Worker from '../../worker';
import api from '../../api';
import { TRANSACTION_PERMISSION_SOCIAL } from '../../utils/constants';
import { getOwnerCredentialsOrShowAuthPopup } from '../users';
import { actions as popupActions } from '../../store/wallet/popup';
import { actions as buyRamActions } from '../../store/wallet/buyRam';
import { actions as sellRamActions } from '../../store/wallet/sellRam';
import { actions as editStakeActions } from '../../store/wallet/editStake';
import { actions as accountActions } from '../../store/wallet/account';
import { actions as transactionsActions } from '../../store/wallet/transactions';

export { default as sendTokens } from './sendTokens';

export const toggle = visible => dispatch => dispatch(popupActions.merge({ visible }));

export const toggleBuyRam = visible => dispatch => dispatch(buyRamActions.merge({ visible }));

export const toggleSellRam = visible => dispatch => dispatch(sellRamActions.merge({ visible }));

export const toggleEditStake = visible => dispatch => dispatch(editStakeActions.merge({ visible }));

export const buyRam = (accountName, amount, privateKey) => () => Worker.buyRam(accountName, privateKey, amount);

export const sellRam = (accountName, amount, privateKey) => () => Worker.sellRam(accountName, privateKey, amount);

export const editStake = (accountName, privateKey, netAmount, cpuAmount) => () =>
  Worker.stakeOrUnstakeTokens(accountName, privateKey, netAmount, cpuAmount);

export const getAccount = accountName => async (dispatch) => {
  const data = await WalletApi.getAccountState(accountName);

  console.log(data);

  data.tokens.uosFutures = await WalletApi.getAccountBalance(accountName, 'UOSF');

  dispatch(accountActions.merge(humps(data)));
};

export const getTransactions = (page, perPage, append = false) => async (dispatch, getState) => {
  const { wallet } = getState();
  const transactions = await api.getTransactions(page, perPage);

  if (append) {
    transactions.data = wallet.transactions.data.concat(transactions.data);
  }

  dispatch(transactionsActions.merge(transactions));
};

export const claimEmission = () => async (dispatch) => {
  const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

  if (!ownerCredentials) {
    return;
  }

  await Worker.claimEmission(ownerCredentials.accountName, ownerCredentials.socialKey, TRANSACTION_PERMISSION_SOCIAL);
  await dispatch(getAccount(ownerCredentials.accountName));
};

export const resetPopup = () => (dispatch) => {
  dispatch(popupActions.reset());
  dispatch(transactionsActions.reset());
  dispatch(accountActions.reset());
};
