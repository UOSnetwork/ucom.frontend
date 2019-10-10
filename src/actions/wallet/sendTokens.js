import { actions as baseActions } from '../../store/wallet/sendTokens';
import { getOwnerCredentialsOrShowAuthPopup, fetchUser } from '../users';
import { addSuccessNotification } from '../notifications';
import { parseResponseError } from '../../utils/errors';
import { getAccount } from './index';
import Worker from '../../worker';

export default class Actions {
  static reset() {
    return baseActions.reset();
  }

  static merge(data) {
    return baseActions.merge(data);
  }

  static show() {
    return baseActions.merge({ visible: true });
  }

  static cancel() {
    return (dispatch, getState) => {
      const state = getState();
      const { failCallbcak } = state.wallet.sendTokens;

      if (typeof failCallbcak === 'function') {
        failCallbcak();
      }

      dispatch(Actions.reset());
    };
  }

  static submit(scatter, activeKey) {
    return async (dispatch, getState) => {
      const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

      if (!ownerCredentials) {
        return;
      }

      let result;
      const state = getState();
      const {
        accountName, amount, memo, loading, successCallback, failCallbcak,
      } = state.wallet.sendTokens;

      if (loading) {
        return;
      }

      dispatch(baseActions.merge({ loading: true }));

      try {
        if (scatter) {
          result = await scatter.sendTokens(ownerCredentials.accountName, accountName, +amount, memo);
        } else if (activeKey) {
          result = await Worker.sendTokens(ownerCredentials.accountName, activeKey, accountName, +amount, memo);
        } else {
          throw new Error('Active key is required');
        }

        if (typeof successCallback === 'function') {
          successCallback(result);
        }

        dispatch(addSuccessNotification('Successfully sent tokens'));
        dispatch(getAccount(ownerCredentials.accountName));
        dispatch(Actions.reset());
      } catch (err) {
        const error = parseResponseError(err)[0].message;
        dispatch(baseActions.merge({
          error,
          loading: false,
        }));

        if (typeof failCallbcak === 'function') {
          failCallbcak(err);
        }
      }
    };
  }

  static send(accountName, amount, memo) {
    return async dispatch =>
      new Promise(async (resolve, reject) => {
        let error;

        try {
          await dispatch(fetchUser(accountName));
        } catch (err) {
          error = `User @${accountName} not found`;
        }

        dispatch(baseActions.merge({
          accountName,
          amount,
          memo,
          error,
          editable: false,
          visible: true,
          successCallback: resolve,
          failCallbcak: reject,
        }));
      });
  }
}
