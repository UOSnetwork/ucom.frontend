export default class Command {
  static getTipCommandRegexp() {
    return /\@tip[ ]+\@([a-z1-5]{12})[ ]+([0-9]+)[ ]+uos/i;
  }

  static stringHasTipCommand(str) {
    return Command.getTipCommandRegexp().test(str);
  }

  static parseTipCommand(str) {
    if (!Command.stringHasTipCommand(str)) {
      return null;
    }

    const [, accountName, amount] = str.match(Command.getTipCommandRegexp());

    return { accountName, amount };
  }
}
