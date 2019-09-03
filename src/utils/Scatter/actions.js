import {
  SMART_CONTRACT_EOSIO_TOKEN,
  SMART_CONTRACT_EISIO,
  SMART_CONTRACT_EMISSION,
  ACTION_DELEGATE_BANDWIDTH,
  ACTION_UNDELEGATE_BANDWIDTH,
  ACTION_TRANSFER,
  ACTION_WITHDRAWAL,
  ACTION_SELL_RAM_BYTES,
  ACTION_BUY_RAM_BYTES,
  ACTION_VOTE_PRODUCER,
  ACTION_VOTE_PRODUCER_CALCULATORS,
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

  static getClaimEmissionAction(authorization, accountNameFrom) {
    return {
      account: SMART_CONTRACT_EMISSION,
      name: ACTION_WITHDRAWAL,
      authorization,
      data: {
        owner: accountNameFrom,
      },
    };
  }

  static getSellRamAction(authorization, accountName, amount) {
    return {
      account: SMART_CONTRACT_EISIO,
      name: ACTION_SELL_RAM_BYTES,
      authorization,
      data: {
        account: accountName,
        bytes: amount,
      },
    };
  }

  static getBuyRamAction(authorization, accountNameFrom, amount, accountNameTo) {
    return {
      account: SMART_CONTRACT_EISIO,
      name: ACTION_BUY_RAM_BYTES,
      authorization,
      data: {
        payer: accountNameFrom,
        receiver: accountNameTo,
        bytes: amount,
      },
    };
  }

  static getVoteForBlockProducersAction(authorization, accountNameFrom, producers) {
    return {
      account: SMART_CONTRACT_EISIO,
      name: ACTION_VOTE_PRODUCER,
      authorization,
      data: {
        voter: accountNameFrom,
        proxy: '',
        producers,
      },
    };
  }

  static getVoteForCalculatorNodesAction(authorization, accountNameFrom, nodes) {
    return {
      account: SMART_CONTRACT_EISIO,
      name: ACTION_VOTE_PRODUCER_CALCULATORS,
      authorization,
      data: {
        voter: accountNameFrom,
        proxy: '',
        calculators: nodes,
      },
    };
  }
}
