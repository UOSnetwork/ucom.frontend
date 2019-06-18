import api from '../api';
import snakes from '../utils/snakes';
import { parseErrors } from '../utils/errors';
import { saveToken } from '../utils/token';
import { saveActiveKey, getActivePrivateKey } from '../utils/keys';
import withLoader from '../utils/withLoader';

export const authReset = () => ({ type: 'AUTH_RESET' });
export const authSetData = payload => ({ type: 'AUTH_SET_DATA', payload });
export const authSetForm = payload => ({ type: 'AUTH_SET_FORM', payload });
export const authSetVisibility = visibility => dispatch => dispatch(authSetData({ visibility }));

export const authShowPopup = redirectUrl => (dispatch) => {
  dispatch(authReset());
  dispatch(authSetData({ redirectUrl }));
  dispatch(authSetVisibility(true));
};

export const authHidePopup = () => (dispatch) => {
  dispatch(authSetVisibility(false));
};

export const authLogin = () => async (dispatch, getState) => {
  const state = getState();
  const { redirectUrl } = state.auth;

  dispatch(authSetData({ loading: true }));

  setTimeout(async () => {
    try {
      const data = await withLoader(api.login(snakes(state.auth.form)));
      saveToken(data.token);
      saveActiveKey(getActivePrivateKey(state.auth.form.brainkey));
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        window.location.reload();
      }
    } catch (e) {
      dispatch(authSetData({
        serverErrors: parseErrors(e),
        loading: false,
      }));
    }
  }, 0);
};
