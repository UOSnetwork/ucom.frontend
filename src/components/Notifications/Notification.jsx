import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import IconBell from '../Icons/BellOutlined';
import IconClose from '../Icons/Close';
import Button from '../Button/index';
import RequestActiveKey from '../Auth/Features/RequestActiveKey';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_BLOCKCHAIN_PERMISSIONS_ERROR,
} from '../../store/notifications';
import { closeNotification, addSuccessNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import multiSignActions from '../../actions/multiSign';
import withLoader from '../../utils/withLoader';

const Notification = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const close = () => {
    dispatch(dispatch(closeNotification(props.id)));
  };

  useEffect(() => {
    if (props.autoClose) {
      setTimeout(close, 5000);
    }
  }, []);

  return (
    <RequestActiveKey
      replace
      onSubmit={async (activeKey) => {
        setLoading(true);
        try {
          await withLoader(dispatch(multiSignActions.updatePermissions(activeKey)));
          dispatch(addSuccessNotification(t('accountPermissionsUpdated')));
          close();
        } catch (err) {
          dispatch(addErrorNotificationFromResponse(err));
        }
        setLoading(false);
      }}
    >
      {requestActiveKey => (
        <div
          className={classNames(
            'notification',
            { 'notification_error': props.type === NOTIFICATION_TYPE_ERROR || NOTIFICATION_TYPE_BLOCKCHAIN_PERMISSIONS_ERROR },
            { 'notification_success': props.type === NOTIFICATION_TYPE_SUCCESS },
          )}
        >
          <div
            role="presentation"
            className="notification__close"
            onClick={close}
          >
            {!loading && <IconClose />}
          </div>
          <div className="notification__header">
            <div className="inline inline_medium">
              <div className="inline__item">
                <div className="notification__icon">
                  <IconBell />
                </div>
              </div>
              <div className="inline__item">
                <div className="notification__title">{props.title}</div>
              </div>
            </div>
          </div>
          {props.type === NOTIFICATION_TYPE_BLOCKCHAIN_PERMISSIONS_ERROR ? (
            <div className="notification__content">
              <div>
                {t('accountPermissionsNeedUpdate')}
              </div>
              <div className="notification__action">
                <Button
                  red
                  small
                  disabled={loading}
                  onClick={() => {
                    requestActiveKey();
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className="notification__content">{props.message}</div>
          )}
        </div>
      )}
    </RequestActiveKey>
  );
};

Notification.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  autoClose: PropTypes.bool,
};

Notification.defaultProps = {
  title: 'Error',
  autoClose: true,
};

export default Notification;
