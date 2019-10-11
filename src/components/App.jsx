import { Route, Switch } from 'react-router';
import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initNotificationsListeners } from '../actions/siteNotifications';
import { fetchMyself } from '../actions/users';
import { Page } from './Layout';
import Auth from './Auth/Features/Login';
import Notifications from './Notifications';
import socket from '../api/socket';
import config from '../../package.json';
import { enableGtm } from '../utils/gtm';
import { initDragAndDropListeners } from '../utils/dragAndDrop';
import routes from '../routes';
import Settings from '../components/Settings';
import { addMaintenanceNotification } from '../actions/notifications';
import HashRouter from '../components/HashRouter';
import CreateOrg from '../pages/Organization/Create';
import SearchPopup from '../components/SearchPopup';
import Subscribe from '../components/Subscribe';
import Loader from '../components/Loader';
import urls from '../utils/urls';
import loader from '../utils/loader';
import { logoutIfNeedBindSocialKey } from '../utils/auth';
import withLoader from '../utils/withLoader';
import mediaQueryActions from '../actions/mediaQuery';
import { UserWallet, BuyRam, SellRam, EditStake, SendTokensWrapper } from '../components/Wallet';

const App = () => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    loader.init(dispatch);

    if (process.env.NODE_ENV === 'production') {
      enableGtm();
    }

    logoutIfNeedBindSocialKey();
    withLoader(dispatch(fetchMyself()));
    dispatch(initNotificationsListeners());
    dispatch(mediaQueryActions.init());

    const removeInitDragAndDropListeners = initDragAndDropListeners(document, () => {
      document.body.classList.add('dragenter');
    }, () => {
      document.body.classList.remove('dragenter');
    });

    if (config.socketEnabled) {
      socket.connect();
    }

    if (config.maintenanceMode) {
      dispatch(addMaintenanceNotification());
    }

    return removeInitDragAndDropListeners;
  }, []);

  return (
    <Fragment>
      <Loader />

      <HashRouter>
        {(route) => {
          switch (route) {
            case urls.getOrganizationCrerateUrl():
              return <CreateOrg />;
            case urls.getSettingsUrl():
              return <Settings />;
            default:
              return null;
          }
        }}
      </HashRouter>

      <Page>
        <Switch>
          {routes.map(route => <Route {...route} key={route.path} />)}
        </Switch>
      </Page>

      <SearchPopup />
      <Subscribe />
      <UserWallet />
      {auth.visibility && <Auth />}
      {wallet.buyRam.visible && <BuyRam />}
      {wallet.sellRam.visible && <SellRam />}
      {wallet.editStake.visible && <EditStake />}
      {wallet.sendTokens.visible && <SendTokensWrapper />}
      <Notifications />
    </Fragment>
  );
};

export default App;
