import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { initNotificationsListeners, siteNotificationsSetUnreadAmount } from '../actions/siteNotifications';
import { fetchMyself } from '../actions/users';
import Page from './Page';
import Auth from './Auth';
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

const App = ({ addMaintenanceNotification, ...props }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      enableGtm();
    }

    props.fetchMyself();
    props.initNotificationsListeners();

    const removeInitDragAndDropListeners = initDragAndDropListeners(document, () => {
      document.body.classList.add('dragenter');
    }, () => {
      document.body.classList.remove('dragenter');
    });

    if (config.socketEnabled) {
      socket.connect();
    }

    if (config.maintenanceMode) {
      addMaintenanceNotification();
    }

    return removeInitDragAndDropListeners;
  }, []);

  return (
    <Fragment>
      <Page>
        <Switch>
          {routes.map(route => <Route {...route} key={route.path} />)}
        </Switch>

        <Auth />
      </Page>

      {props.settings.visible && <Settings />}
      {props.wallet.buyRamVisible && <BuyRam />}
      {props.wallet.sellRamVisible && <SellRam />}
      {props.wallet.editStakeVisible && <EditStake />}
      {props.wallet.sendTokensVisibility && <SendTokens />}
      <Notifications />
    </Fragment>
  );
};

App.propTypes = {
  fetchMyself: PropTypes.func.isRequired,
  initNotificationsListeners: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
  }).isRequired,
  wallet: PropTypes.shape({
    buyRamVisible: PropTypes.bool.isRequired,
    sellRamVisible: PropTypes.bool.isRequired,
    editStakeVisible: PropTypes.bool.isRequired,
    sendTokensVisibility: PropTypes.bool.isRequired,
  }).isRequired,
  addMaintenanceNotification: PropTypes.func.isRequired,
};

export default withRouter(connect(
  state => ({
    auth: state.auth,
    wallet: state.walletSimple,
    settings: state.settings,
  }),
  {
    fetchMyself,
    initNotificationsListeners,
    siteNotificationsSetUnreadAmount,
    addMaintenanceNotification,
  },
)(App));
