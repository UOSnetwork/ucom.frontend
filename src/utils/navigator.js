export default class {
  static isIos() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }
}
