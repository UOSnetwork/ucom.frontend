import api from '../api';
import Worker from '../worker';

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
  const data = await api.getAccountState(accountName);

  data.tokens.uosFutures = await api.getAccountBalance(accountName, 'UOSF');

  dispatch({
    type: 'WALLET_SET_DATA',
    payload: data,
  });
};

export const walletBuyRam = (accountName, amount, privateKey) => async (dispatch) => {
  const data = await Worker.buyRam(accountName, privateKey, amount);

  dispatch(walletGetAccount(accountName));

  return data;
};

export const walletSellRam = (accountName, amount, privateKey) => async (dispatch) => {
  const data = await Worker.sellRam(accountName, privateKey, amount);

  dispatch(walletGetAccount(accountName));

  return data;
};

export const walletEditStake = (accountName, privateKey, netAmount, cpuAmount) => async (dispatch) => {
  const data = await Worker.stakeOrUnstakeTokens(accountName, privateKey, netAmount, cpuAmount);

  dispatch(walletGetAccount(accountName));

  return data;
};

export const walletSendTokens = (accountNameFrom, accountNameTo, amount, memo, privateKey) => async (dispatch) => {
  const data = await Worker.sendTokens(accountNameFrom, privateKey, accountNameTo, amount, memo);

  dispatch(walletGetAccount(accountNameFrom));

  return data;
};

export const walletGetEmission = (
  accountName,
  privateKey,
) => async (dispatch) => {
  const data = await api.claimEmission(accountName, privateKey);

  dispatch(walletGetAccount(accountName));

  return data;
};
