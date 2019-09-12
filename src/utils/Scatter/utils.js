import { CORE_TOKEN_NAME } from './constants';

export default class Amount {
  static getUosAmountAsString(amount, symbol = CORE_TOKEN_NAME) {
    return `${Math.floor(amount)}.0000 ${symbol}`;
  }

  static getTokensAmountFromString(stringValue, token = CORE_TOKEN_NAME) {
    const value = stringValue.replace(` ${token}`, '');
    return +value;
  }

  static getRamAmountFromString(stringValue) {
    const value = stringValue.replace(' RAM', '');
    return +value;
  }
}
