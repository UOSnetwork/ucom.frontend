import { uniq } from 'lodash';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { Api } from 'eosjs';
import Network from './network';
import Utils from './utils';
import Validator from './validator';
import Actions from './actions';
import { BLOCKS_BEHIND, EXPIRE_SECONDS } from './constants';
import { PERMISSION_ACTIVE } from '../constants';

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

  async getLoginData() {
    const accountName = this.account.name;
    const publicKey = await ScatterJS.getPublicKey('eos');
    const sign = await ScatterJS.getArbitrarySignature(publicKey, accountName);

    return { accountName, publicKey, sign };
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

    await Promise.all([
      Validator.isAccountNameExitOrException(accountNameFrom),
      Validator.isAccountNameExitOrException(accountNameTo),
      Validator.isEnoughBalanceOrException(accountNameFrom, amount),
    ]);

    const actions = [Actions.getSendTokensAction(this.authorization, accountNameFrom, accountNameTo, amount, memo)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async stakeOrUnstakeTokens(accountName, netAmount, cpuAmount) {
    Validator.isNonNegativeNetAmountOrException(netAmount);
    Validator.isNonNegativeCpuAmountOrException(cpuAmount);
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);

    const [, { net: currentNet, cpu: currentCpu }] = await Promise.all([
      Validator.isAccountNameExitOrException(accountName),
      Network.getCurrentNetAndCpuStakedTokens(accountName),
    ]);

    const netDelta = netAmount - currentNet;
    const cpuDelta = cpuAmount - currentCpu;
    const checkBalansePromises = [];

    if (netDelta > 0) {
      checkBalansePromises.push(Validator.isEnoughBalanceOrException(accountName, netDelta));
    }

    if (cpuDelta > 0) {
      checkBalansePromises.push(Validator.isEnoughBalanceOrException(accountName, cpuDelta));
    }

    await Promise.all(checkBalansePromises);

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
    await Promise.all([
      Validator.isAccountNameExitOrException(accountName),
      Validator.isEnoughRamOrException(accountName, bytesAmount),
      Validator.isMinUosAmountForRamOrException(bytesAmount),
    ]);

    const actions = [Actions.getSellRamAction(this.authorization, accountName, bytesAmount)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async buyRam(accountName, bytesAmount) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);
    Validator.isNonNegativeBytesAmountOrException(bytesAmount);

    const [, price] = await Promise.all([
      Validator.isAccountNameExitOrException(accountName),
      Validator.isMinUosAmountForRamOrException(bytesAmount),
    ]);

    await Validator.isEnoughBalanceOrException(accountName, price);

    const actions = [Actions.getBuyRamAction(this.authorization, accountName, bytesAmount, accountName)];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async voteForBlockProducers(accountName, producers) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);

    if (producers.length > 30) {
      throw new Error('It is possible to vote up to 30 block producers');
    }

    const [userInfo] = await Promise.all([
      Validator.isAccountNameExitOrException(accountName),
      Validator.isBlockProducersExistOrExeption(producers),
    ]);

    const netSelfDelegated = Utils.getTokensAmountFromString(userInfo.self_delegated_bandwidth.net_weight);
    const cpuSelfDelegated = Utils.getTokensAmountFromString(userInfo.self_delegated_bandwidth.cpu_weight);

    if (netSelfDelegated + cpuSelfDelegated === 0) {
      throw new Error('It is possible to vote only if you have self-staked tokens.');
    }

    producers.sort();

    const actions = [Actions.getVoteForBlockProducersAction(this.authorization, accountName, uniq(producers))];
    const result = await this.sendTransaction(actions);

    return result;
  }

  async voteForCalculatorNodes(accountName, nodes) {
    Validator.isAccountNameAnActorOrExceptionAndLogout(this.account.name, accountName);

    if (nodes.length > 30) {
      throw new Error('It is possible to vote up to 30 calculator nodes');
    }

    const userInfo = await Validator.isAccountNameExitOrException(accountName);
    const netSelfDelegated = Utils.getTokensAmountFromString(userInfo.self_delegated_bandwidth.net_weight);
    const cpuSelfDelegated = Utils.getTokensAmountFromString(userInfo.self_delegated_bandwidth.cpu_weight);

    if (netSelfDelegated + cpuSelfDelegated === 0) {
      throw new Error('It is possible to vote only if you have self-staked tokens.');
    }

    nodes.sort();

    const actions = [Actions.getVoteForCalculatorNodesAction(this.authorization, accountName, uniq(nodes))];
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

export class ScatterNew {
  constructor() {
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }

  async connect() {
    try {
      const network = await Network.getNetwork();
      this.connected = Boolean(await ScatterJS.connect('U.Community', { network }));
    } catch (err) {
      this.connected = false;
    }
  }

  async login() {
    const id = await ScatterJS.login();

    if (!id) {
      throw new Error('Scatter is no identity');
    }

    const account = ScatterJS.account('eos');

    return account;
  }

  async loginByAuthority(authority) {
    if (!authority) {
      throw new Error('Authority is required argument');
    }

    let account;

    const login = async () => {
      const testAccount = await this.login();

      if (testAccount.authority !== authority) {
        await ScatterJS.logout();
        await login();
      } else {
        account = testAccount;
      }

      return undefined;
    };

    await login();

    return account;
  }

  async sign(publicKey, str) {
    const sign = await ScatterJS.getArbitrarySignature(publicKey, str);

    return sign;
  }

  async getFollowOrUnfollowAccountSignedTransaction(userAccountName, isFollow) {
    const account = await this.loginByAuthority(PERMISSION_ACTIVE);
    const network = await Network.getNetwork();
    const rpc = Network.getRpc();
    const eos = ScatterJS.eos(network, Api, { rpc });

    const signedTransaction = await eos.transact({
      actions: [{
        account: 'uos.activity',
        name: 'socialactndt',
        authorization: [{
          actor: account.name,
          permission: account.authority,
        }],
        data: {
          acc: account.name,
          action_json: JSON.stringify({
            interaction: isFollow ? 'follow_to_account' : 'unfollow_to_account',
            data: {
              account_from: account.name,
              account_to: userAccountName,
            },
          }),
          action_data: '',
        },
      }],
    }, {
      blocksBehind: BLOCKS_BEHIND,
      expireSeconds: EXPIRE_SECONDS,
      broadcast: false,
    });

    return signedTransaction;
  }
}

export const scatter = new ScatterNew();
