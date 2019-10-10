import { copyToClipboard } from '../utils/text';
import { addSuccessNotification } from './notifications';

export default class {
  static copyToClipboard(str) {
    return (dispatch) => {
      copyToClipboard(str);
      dispatch(addSuccessNotification('Text copied to clipboard'));
    };
  }
}
