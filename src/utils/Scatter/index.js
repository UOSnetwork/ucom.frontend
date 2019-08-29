import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { Api } from 'eosjs';
import Network from './network';
import Utils from './utils';
import Validator from './validator';
import { SMART_CONTRACT_EOSIO_TOKEN, ACTION_TRANSFER, BLOCKS_BEHIND, EXPIRE_SECONDS } from './constants';

ScatterJS.plugins(new ScatterEOS());

export default class Scatter {
  constructor(eos, account) {
    this.eos = eos;
    this.account = account;
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

    const result = await this.sendTransaction([{
      account: SMART_CONTRACT_EOSIO_TOKEN,
      name: ACTION_TRANSFER,
      authorization: [{
        actor: this.account.name,
        permission: this.account.authority,
      }],
      data: {
        from: accountNameFrom,
        to: accountNameTo,
        quantity: Utils.getUosAmountAsString(amount),
        memo,
      },
    }]);

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
