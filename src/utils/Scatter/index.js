import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { Api } from 'eosjs';
import Network from './network';
import Amount from './amount';
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
    Network.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountNameFrom);
    await Network.isAccountNameExitOrException(accountNameFrom);
    await Network.isAccountNameExitOrException(accountNameTo);
    await Network.isEnoughBalanceOrException(accountNameFrom, amount);

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
        quantity: Amount.getUosAmountAsString(amount),
        memo,
      },
    }]);

    return result;
  }

  // async stakeOrUnstakeTokens(accountName, netAmount, cpuAmount) {
  //   Network.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);
  //   await Network.isAccountNameExitOrException(accountName);
  // }

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
