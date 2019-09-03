import {
  SMART_CONTRACT_EOSIO_TOKEN,
  SMART_CONTRACT_EISIO,
  ACTION_DELEGATE_BANDWIDTH,
  ACTION_UNDELEGATE_BANDWIDTH,
  ACTION_TRANSFER,
} from './constants';
import Utils from './utils';

export default class Actions {
  static getSendTokensAction(authorization, accountNameFrom, accountNameTo, amount, memo) {
    return {
      account: SMART_CONTRACT_EOSIO_TOKEN,
      name: ACTION_TRANSFER,
      authorization,
      data: {
        from: accountNameFrom,
        to: accountNameTo,
        quantity: Utils.getUosAmountAsString(amount),
        memo,
      },
    };
  }

  static getDelegateBandwidthAction(authorization, accountNameFrom, stakeNetAmount, stakeCpuAmount, accountNameTo, transfer) {
    accountNameTo = accountNameTo || accountNameFrom;

    return {
      account: SMART_CONTRACT_EISIO,
      name: ACTION_DELEGATE_BANDWIDTH,
      authorization,
      data: {
        from: accountNameFrom,
        receiver: accountNameTo,
        stake_net_quantity: stakeNetAmount,
        stake_cpu_quantity: stakeCpuAmount,
        transfer,
      },
    };
  }

  static getUnstakeTokensAction(authorization, accountNameFrom, netAmount, cpuAmount, accountNameTo, transfer) {
    return {
      account: SMART_CONTRACT_EISIO,
      name: ACTION_UNDELEGATE_BANDWIDTH,
      authorization,
      data: {
        from: accountNameFrom,
        receiver: accountNameTo,
        unstake_net_quantity: netAmount,
        unstake_cpu_quantity: cpuAmount,
        transfer,
      },
    };
  }
}
