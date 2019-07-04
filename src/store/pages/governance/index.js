import { combineReducers } from 'redux';
import main from './main';
import voting from './voting';

export default combineReducers({
  main,
  voting,
});
