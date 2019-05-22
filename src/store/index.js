import thunk from 'redux-thunk';
import * as redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import post from '../store/post';
import auth from './auth';
import organization from './organization';
import notifications from './notifications';
import siteNotifications from './siteNotifications';
import posts from './posts';
import users from './users';
import comments from './comments';
import organizations from './organizations';
import menuPopup from './menuPopup';
import userForm from './userForm';
import governance from './governance/index';
import registration from './registration';
import mainPostGroup from './mainPostGroup';
import feed from './feed';
import tags from './tags';
import communityFeed from './communityFeed';
import tagsFeed from './tagsFeed';
import user from './user';
import settings from './settings';
import walletSimple from './walletSimple';

export const createStore = () => {
  const reducers = redux.combineReducers({
    settings,
    user,
    post,
    auth,
    organization,
    notifications,
    siteNotifications,
    posts,
    users,
    comments,
    organizations,
    menuPopup,
    userForm,
    governance,
    registration,
    mainPostGroup,
    feed,
    tags,
    communityFeed,
    tagsFeed,
    walletSimple,
  });
  const middlewares = [thunk];
  let preloadedState;

  if (typeof window !== 'undefined' && window.APP_STATE !== undefined) {
    preloadedState = window.APP_STATE;
    delete window.APP_STATE;
  }

  return redux.createStore(
    reducers,
    preloadedState,
    composeWithDevTools(redux.applyMiddleware(...middlewares)),
  );
};
