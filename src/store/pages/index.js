import { combineReducers } from 'redux';
import governance from './governance';
import users from './users';
import editPost from './editPost';

export default combineReducers({
  governance,
  users,
  editPost,
});
