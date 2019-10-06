import thunk from 'redux-thunk';
import * as redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import notifications from './notifications';
import siteNotifications from './siteNotifications';
import posts from './posts';
import users from './users';
import comments from './comments';
import organizations from './organizations';
import registration from './registration';
import feed from './feed';
import tags from './tags';
import communityFeed from './communityFeed';
import tagsFeed from './tagsFeed';
import user from './user';
import wallet from './wallet/index';
import mainPage from './mainPage';
import mainPageUser from './mainPageUser';
import userPage from './userPage';
import orgPage from './orgPage';
import nodes from './nodes';
import pages from './pages';
import settings from './settings';
import searchPopup from './searchPopup';
import subscribe from './subscribe';
import ieobanner from './ieobanner';
import loader from './loader';
import mediaQuery from './mediaQuery';

export const createStore = () => {
  const reducers = redux.combineReducers({
    mediaQuery,
    loader,
    ieobanner,
    subscribe,
    settings,
    searchPopup,
    pages,
    mainPage,
    mainPageUser,
    userPage,
    orgPage,
    user,
    auth,
    notifications,
    siteNotifications,
    posts,
    users,
    comments,
    organizations,
    registration,
    feed,
    tags,
    communityFeed,
    tagsFeed,
    wallet,
    nodes,
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

export * from './selectors';
