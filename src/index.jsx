import Cookies from 'js-cookie';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { createStore } from './store';
import './index.less';
import i18n from './i18n';

i18n(Cookies.get('lang'));

const store = createStore();
const history = createBrowserHistory();

document.querySelector('body').style.display = null;

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
