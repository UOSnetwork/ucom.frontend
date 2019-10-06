import { combineReducers } from 'redux';
import popup from './popup';
import transactions from './transactions';
import account from './account';
import editStake from './editStake';
import buyRam from './buyRam';
import sellRam from './sellRam';
import sendTokens from './sendTokens';

export default combineReducers({
  popup,
  transactions,
  account,
  editStake,
  buyRam,
  sellRam,
  sendTokens,
});
