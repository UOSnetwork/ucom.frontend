import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import React, { useEffect } from 'react';
import * as authActions from '../../../actions/auth';
import { hideNotificationTooltip } from '../../../actions/siteNotifications';
import * as searchPopupActions from '../../../actions/searchPopup';
import styles from './styles.css';

const Page = ({ location, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.hidePopup());
    dispatch(searchPopupActions.hide());
    dispatch(hideNotificationTooltip());
  }, [location]);

  return (
    <div className={styles.page}>
      {children}
    </div>
  );
};

export default withRouter(Page);
