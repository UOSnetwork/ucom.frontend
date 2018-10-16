import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from '../Avatar';
import Button from '../Button';
import { CongratulationsIcon } from '../Icons/FeedIcons';
import { confirmNotification, declineNotification } from '../../actions/siteNotifications';

const NotificationCardCongratulations = ({
  updatedAt,
  confirmNotification,
  declineNotification,
  id,
  finished,
}) => (
  <div className="notification-card notification-card_congratulations">
    <div className="notification-card__block">
      <div className="notification-card__avatar" >
        <Avatar srcComponent={<CongratulationsIcon />} />
      </div>
      <div className="notification-card__content">
        <div className="notification-card__text notification-card__description">
          <strong>Whooooooa! Сongratulations!</strong>
          <p className="notification-card__time">{updatedAt}</p>
        </div>
      </div>
    </div>
    <p className="notification-card__text_congratulations">
    Welcome my friend. You just joined the U. Community.
     We sent a confirmation letter on your e-mail.
    </p>
    {
      !finished &&
      <div className="inline notification-card__buttons">
        <div className="inline__item">
          <Button
            theme="accent-light"
            size="small"
            text="Confirm"
            isStretched
            onClick={() => confirmNotification(id)}
          />
        </div>
        <div className="inline__item">
          <Button
            theme="accent-gray"
            size="small"
            text="Decline"
            isStretched
            onClick={() => declineNotification(id)}
          />
        </div>
      </div>
    }
  </div>
);

NotificationCardCongratulations.propTypes = {
  // username: PropTypes.string,
  updatedAt: PropTypes.string,
  finished: PropTypes.bool,
  id: PropTypes.number,
  confirmNotification: PropTypes.func,
  declineNotification: PropTypes.func,
};

export default connect(
  null,
  dispatch => ({
    confirmNotification: data => dispatch(confirmNotification(data)),
    declineNotification: data => dispatch(declineNotification(data)),
  }),
)(NotificationCardCongratulations);
