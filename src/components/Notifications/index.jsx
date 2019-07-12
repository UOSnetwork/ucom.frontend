import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useSelector } from 'react-redux';
import React from 'react';
import Notification from './Notification';

// TODO: Css modules
const Notifications = () => {
  const notifications = useSelector(state => state.notifications);
  const list = notifications.list.filter(item => !item.closed);

  return (
    <div className="notifications">
      <TransitionGroup className="notifications__list">
        {list.map(item => (
          <CSSTransition
            key={item.id}
            timeout={500}
            classNames="fade"
          >
            <div className="notifications__item" key={item.id}>
              <Notification {...item} />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default Notifications;
