import thunk from 'redux-thunk';
import * as redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import post from '../store/post';
import auth from './auth';
import notifications from './notifications';
import siteNotifications from './siteNotifications';
import posts from './posts';
import users from './users';
import comments from './comments';
import organizations from './organizations';
import menuPopup from './menuPopup';
import governance from './governance/index';
import registration from './registration';
import mainPosts from './mainPosts';
import feed from './feed';
import tags from './tags';
import communityFeed from './communityFeed';
import tagsFeed from './tagsFeed';
import user from './user';
import walletSimple from './walletSimple';
import mainPage from './mainPage';
import mainPageUser from './mainPageUser';

export const createStore = () => {
  const reducers = redux.combineReducers({
    mainPage,
    mainPageUser,
    user,
    post,
    auth,
    notifications,
    siteNotifications,
    posts,
    users,
    comments,
    organizations,
    menuPopup,
    governance,
    registration,
    mainPosts,
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
