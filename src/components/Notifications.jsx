import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import React from 'react';
import Notification from './Notifications/Notification';

// TODO: Move to Notifications
const Notifications = props => (
  <div className="notifications">
    <TransitionGroup className="notifications__list">
      {props.notifications.list.filter(item => !item.closed).map(item => (
        <CSSTransition
          key={item.id}
          timeout={500}
          classNames="fade"
        >
          <div className="notifications__item" key={item.id}>
            <Notification
              {...item}
              id={item.id}
            />
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  </div>
);

Notifications.propTypes = {
  notifications: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default connect(state => ({
  notifications: state.notifications,
}))(Notifications);
