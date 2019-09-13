import humps from 'lodash-humps';
import { WalletApi } from 'ucom-libs-wallet';
import Worker from '../worker';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';

export const walletToggleBuyRam = visible => ({
  type: 'WALLET_SET_BUY_RAM_VISIBLE',
  payload: visible,
});

export const walletToggleSellRam = visible => ({
  type: 'WALLET_SET_SELL_RAM_VISIBLE',
  payload: visible,
});

export const walletToggleEditStake = visible => ({
  type: 'WALLET_SET_EDIT_STAKE_VISIBLE',
  payload: visible,
});

export const walletToggleSendTokens = visible => ({
  type: 'WALLET_SET_SEND_TOKENS_VISIBLE',
  payload: visible,
});

export const walletGetAccount = accountName => async (dispatch) => {
  const data = humps(await WalletApi.getAccountState(accountName));

  data.tokens.uosFutures = humps(await WalletApi.getAccountBalance(accountName, 'UOSF'));

  dispatch({
    type: 'WALLET_SET_DATA',
    payload: data,
  });
};

export const walletBuyRam = (accountName, amount, privateKey) => async () => {
  const data = await Worker.buyRam(accountName, privateKey, amount);

  return data;
};

export const walletSellRam = (accountName, amount, privateKey) => async () => {
  const data = await Worker.sellRam(accountName, privateKey, amount);

  return data;
};

export const walletEditStake = (accountName, privateKey, netAmount, cpuAmount) => async () => {
  const data = await Worker.stakeOrUnstakeTokens(accountName, privateKey, netAmount, cpuAmount);

  return data;
};

export const walletSendTokens = (accountNameFrom, accountNameTo, amount, memo, privateKey) => async () => {
  const data = await Worker.sendTokens(accountNameFrom, privateKey, accountNameTo, amount, memo);

  return data;
};

export const walletGetEmission = (accountName, privateKey) => async () => {
  const data = await Worker.claimEmission(accountName, privateKey, TRANSACTION_PERMISSION_SOCIAL);

  return data;
};
