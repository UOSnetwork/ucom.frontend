import { Route, Switch } from 'react-router';
import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initNotificationsListeners } from '../actions/siteNotifications';
import { fetchMyself } from '../actions/users';
import { Page } from './Layout';
import Auth from './Auth/Features/LoginSimple';
import Notifications from './Notifications';
import socket from '../api/socket';
import config from '../../package.json';
import { enableGtm } from '../utils/gtm';
import { initDragAndDropListeners } from '../utils/dragAndDrop';
import routes from '../routes';
import Settings from '../components/Settings';
import BuyRam from '../components/Resources/Actions/BuyRam';
import SellRam from '../components/Resources/Actions/SellRam';
import EditStake from '../components/Resources/Actions/EditStake';
import SendTokens from '../components/Resources/Actions/SendTokens';
import { addMaintenanceNotification } from '../actions/notifications';
import HashRouter from '../components/HashRouter';
import CreateOrg from '../pages/Organization/Create';
import urls from '../utils/urls';

const App = () => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.walletSimple);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      enableGtm();
    }

    dispatch(fetchMyself());
    dispatch(initNotificationsListeners());

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

      <Auth />

      {wallet.buyRamVisible && <BuyRam />}
      {wallet.sellRamVisible && <SellRam />}
      {wallet.editStakeVisible && <EditStake />}
      {wallet.sendTokensVisibility && <SendTokens />}

      <Notifications />
    </Fragment>
  );
};

export default App;
