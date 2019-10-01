import classNames from 'classnames';
import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import React, { useEffect } from 'react';
import * as authActions from '../../../actions/auth';
import { hideNotificationTooltip } from '../../../actions/siteNotifications';
import * as searchPopupActions from '../../../actions/searchPopup';
import * as subscribeActions from '../../../actions/subscribe';
import * as walletActions from '../../../actions/wallet';
import styles from './styles.css';

const Page = ({ location, children }) => {
  const dispatch = useDispatch();
  const ieobanner = useSelector(state => state.ieobanner, isEqual);

  useEffect(() => {
    dispatch(authActions.hidePopup());
    dispatch(searchPopupActions.hide());
    dispatch(hideNotificationTooltip());
    dispatch(subscribeActions.hide());
    dispatch(walletActions.toggle(false));
  }, [location]);

  return (
    <div
      className={classNames({
        [styles.page]: true,
        [styles.ieobanner]: ieobanner.visible,
      })}
    >
      {children}
    </div>
  );
};

export default withRouter(Page);
