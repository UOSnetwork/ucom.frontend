import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { Api } from 'eosjs';
import Network from './network';
import Utils from './utils';
import Validator from './validator';
import Actions from './actions';
import { BLOCKS_BEHIND, EXPIRE_SECONDS } from './constants';

ScatterJS.plugins(new ScatterEOS());

export default class Scatter {
  constructor(eos, account) {
    this.eos = eos;
    this.account = account;
    this.authorization = [{
      actor: this.account.name,
      permission: this.account.authority,
    }];
  }

  async sendTransaction(actions) {
    const result = await this.eos.transact({
      actions,
    }, {
      blocksBehind: BLOCKS_BEHIND,
      expireSeconds: EXPIRE_SECONDS,
    });

    return result;
  }

  async sendTokens(accountNameFrom, accountNameTo, amount, memo) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountNameFrom);
    await Validator.isAccountNameExitOrException(accountNameFrom);
    await Validator.isAccountNameExitOrException(accountNameTo);
    await Validator.isEnoughBalanceOrException(accountNameFrom, amount);

    const actions = [Actions.getSendTokensAction(this.authorization, accountNameFrom, accountNameTo, amount, memo)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async stakeOrUnstakeTokens(accountName, netAmount, cpuAmount) {
    Validator.isNonNegativeNetAmountOrException(netAmount);
    Validator.isNonNegativeCpuAmountOrException(cpuAmount);
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);
    await Validator.isAccountNameExitOrException(accountName);

    const { net: currentNet, cpu: currentCpu } = await Network.getCurrentNetAndCpuStakedTokens(accountName);
    const netDelta = netAmount - currentNet;
    const cpuDelta = cpuAmount - currentCpu;

    if (netDelta > 0) {
      await Validator.isEnoughBalanceOrException(accountName, netDelta);
    }

    if (cpuDelta > 0) {
      await Validator.isEnoughBalanceOrException(accountName, cpuDelta);
    }

    const actions = [];

    if (netDelta !== 0) {
      const netString = Utils.getUosAmountAsString(Math.abs(netDelta));
      const cpuString = Utils.getUosAmountAsString(0);
      const action = netDelta > 0 ?
        Actions.getDelegateBandwidthAction(this.authorization, accountName, netString, cpuString, accountName, false) :
        Actions.getUnstakeTokensAction(this.authorization, accountName, netString, cpuString, accountName, false);
      actions.push(action);
    }

    if (cpuDelta !== 0) {
      const netString = Utils.getUosAmountAsString(0);
      const cpuString = Utils.getUosAmountAsString(Math.abs(cpuDelta));
      const action = cpuDelta > 0 ?
        Actions.getDelegateBandwidthAction(this.authorization, accountName, netString, cpuString, accountName, false) :
        Actions.getUnstakeTokensAction(this.authorization, accountName, netString, cpuString, accountName, false);
      actions.push(action);
    }

    if (actions.length === 0) {
      return null;
    }

    const result = await this.sendTransaction(actions);

    return result;
  }

  async claimEmission(accountName) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);
    await Validator.isAccountNameExitOrException(accountName);
    const actions = [Actions.getClaimEmissionAction(this.authorization, accountName)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async sellRam(accountName, bytesAmount) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);
    Validator.isNonNegativeBytesAmountOrException(bytesAmount);
    await Validator.isAccountNameExitOrException(accountName);
    await Validator.isEnoughRamOrException(accountName, bytesAmount);
    await Validator.isMinUosAmountForRamOrException(bytesAmount);

    const actions = [Actions.getSellRamAction(this.authorization, accountName, bytesAmount)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async buyRam(accountName, bytesAmount) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);
    Validator.isNonNegativeBytesAmountOrException(bytesAmount);
    const price = await Validator.isMinUosAmountForRamOrException(bytesAmount);
    await Validator.isEnoughBalanceOrException(accountName, price);

    const actions = [Actions.getBuyRamAction(this.authorization, accountName, bytesAmount, accountName)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  static async connect() {
    const network = await Network.getNetwork();
    const connected = await ScatterJS.connect('U.Community', { network });

    if (!connected) {
      throw new Error('The user rejected request, or doesn\'t have the appropriate requirements');
    }

    const id = await ScatterJS.login();

    if (!id) {
      throw new Error('No identity');
    }

    const rpc = Network.getRpc();
    const eos = ScatterJS.eos(network, Api, { rpc });
    const account = ScatterJS.account('eos');

    return new Scatter(eos, account);
  }
}
