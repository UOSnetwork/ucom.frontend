import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import IconBell from '../Icons/BellOutlined';
import IconClose from '../Icons/Close';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
} from '../../store/notifications';
import { closeNotification } from '../../actions/notifications';

const Notification = (props) => {
  const dispatch = useDispatch();

  const close = () => {
    dispatch(dispatch(closeNotification(props.id)));
  };

  useEffect(() => {
    if (props.autoClose) {
      setTimeout(close, 5000);
    }
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        { 'notification_error': props.type === NOTIFICATION_TYPE_ERROR },
        { 'notification_success': props.type === NOTIFICATION_TYPE_SUCCESS },
      )}
    >
      <div
        role="presentation"
        className="notification__close"
        onClick={close}
      >
        <IconClose />
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
      <div className="notification__content">{props.message}</div>
    </div>
  );
};

Notification.propTypes = {
  id: PropTypes.number.isRequired,
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
