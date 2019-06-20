import { connect } from 'react-redux';
import React from 'react';
import DefaultNotification from './DefaultNotification';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
} from '../../store/notifications';
import { closeNotification } from '../../actions/notifications';

const Notification = (props) => {
  switch (props.type) {
    case NOTIFICATION_TYPE_ERROR:
    case NOTIFICATION_TYPE_SUCCESS:
      return (
        <DefaultNotification
          {...props}
          typeId={props.type}
          onClose={() => props.closeNotification(props.id)}
        />
      );

    default:
      return null;
  }
};

export default connect(null, {
  closeNotification,
})(Notification);
