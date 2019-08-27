import ScatterJS from '@scatterjs/core';
import { JsonRpc } from 'eosjs';
import { getBlockchainHost, getBlockchainPort, getBlockchainProtocol } from '../config';
import { SMART_CONTRACT_EOSIO_TOKEN, CORE_TOKEN_NAME } from './constants';

export default class Network {
  static getRpc() {
    const host = getBlockchainHost();
    const protocol = getBlockchainProtocol();
    const port = getBlockchainPort();

    return new JsonRpc(`${protocol}://${host}:${port}`);
  }

  static async getInfo() {
    const rps = Network.getRpc();
    const info = await rps.get_info();

    return info;
  }

  static async getNetwork() {
    const info = await Network.getInfo();

    return ScatterJS.Network.fromJson({
      blockchain: 'eos',
      chainId: info.chain_id,
      protocol: getBlockchainProtocol(),
      host: getBlockchainHost(),
      port: getBlockchainPort(),
    });
  }

  static async isAccountNameExitOrException(accountName) {
    const rpc = Network.getRpc();

    try {
      await rpc.get_account(accountName);
      return true;
    } catch (err) {
      throw new Error('Probably account does not exist. Please check spelling.');
    }
  }

  static async isEnoughBalanceOrException(accountName, amount) {
    const rpc = Network.getRpc();
    let balance;

    try {
      balance = await rpc.get_currency_balance(SMART_CONTRACT_EOSIO_TOKEN, accountName, CORE_TOKEN_NAME);
    } catch (err) {
      throw new Error('Could not complete request, please try again later');
    }

    if (!balance.length || +parseFloat(balance[0]).toFixed(4) < +amount.toFixed(4)) {
      throw new Error('Not enough tokens. Please correct input data');
    }
  }

  static isAccountNameAnActorOrExceptionAndLogout(actorAccountName, testAccountName) {
    if (actorAccountName !== testAccountName) {
      ScatterJS.logout();
      throw new Error('The user does not match the user of the scatter');
    }
  }
}
