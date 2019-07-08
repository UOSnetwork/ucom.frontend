import { combineReducers } from 'redux';
import governance from './governance';
import users from './users';

export default combineReducers({
  governance,
  users,
});
