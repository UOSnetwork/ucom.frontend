import { CORE_TOKEN_NAME } from './constants';

export default class Amount {
  static getUosAmountAsString(amount, symbol = CORE_TOKEN_NAME) {
    return `${Math.floor(amount)}.0000 ${symbol}`;
  }
}
