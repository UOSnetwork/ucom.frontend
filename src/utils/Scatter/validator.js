import { difference } from 'lodash';
import ScatterJS from '@scatterjs/core';
import Network from './network';
import { SMART_CONTRACT_EOSIO_TOKEN, CORE_TOKEN_NAME, TABLE_ROWS_LIMIT_ALL } from './constants';

export default class Validator {
  static isAccountNameAnActorOrExceptionAndLogout(actorAccountName, testAccountName) {
    if (actorAccountName !== testAccountName) {
      ScatterJS.logout();
      throw new Error('The user does not match the user of the scatter');
    }
  }

  static async isEnoughRamOrException(accountName, bytesAmount) {
    const balance = await Network.getFreeRamAmountInBytes(accountName);

    if (balance < bytesAmount) {
      throw new Error('Not enough free RAM. Please correct input data');
    }
  }

  static async isMinUosAmountForRamOrException(bytesAmount) {
    Validator.isNonNegativeBytesAmountOrException(bytesAmount);
    const rate = await Network.getCurrentTokenPerRamByte();
    const price = +(bytesAmount * rate).toFixed(6);

    if (price < 1) {
      throw new Error('Please increase amounts of bytes - total UOS price must be more or equal 1');
    }

    return price;
  }

  static async isAccountNameExitOrException(accountName) {
    const rpc = Network.getRpc();

    try {
      const response = await rpc.get_account(accountName);
      return response;
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

  static async isBlockProducersExistOrExeption(producers) {
    const rpc = Network.getRpc();
    const allProducers = await rpc.get_producers(true, '', TABLE_ROWS_LIMIT_ALL);
    const producersIndex = [];
    for (let i = 0; i < allProducers.rows.length; i += 1) {
      const producer = allProducers.rows[i];
      producersIndex.push(producer.owner);
    }
    const notExisted = difference(producers, producersIndex);
    if (notExisted.length > 0) {
      throw new Error(`There is no such block producers: ${notExisted.join(', ')}`);
    }
  }

  static isNonNegativeIntOrException(value, exceptionMessage) {
    if (Number.isInteger(value) && +value >= 0) {
      return true;
    }

    throw new Error(exceptionMessage);
  }

  static makeNonNegativeIntExceptionMessage(fieldName = 'Input value') {
    return `${fieldName} must be an integer and greater than or equal to zero`;
  }

  static isNonNegativeNetAmountOrException(value) {
    Validator.isNonNegativeIntOrException(value, Validator.makeNonNegativeIntExceptionMessage('Net amount'));
  }

  static isNonNegativeCpuAmountOrException(value) {
    Validator.isNonNegativeIntOrException(value, Validator.makeNonNegativeIntExceptionMessage('Cpu amount'));
  }

  static isNonNegativeBytesAmountOrException(value) {
    Validator.isNonNegativeIntOrException(value, Validator.makeNonNegativeIntExceptionMessage('Bytes amount'));
  }
}
