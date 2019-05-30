import React from 'react';
import { withRouter } from 'react-router-dom';
import IconClose from './Icons/Close';

const Close = props => (
  <div
    className="close"
    role="presentation"
    onClick={() => {
      if (typeof props.onClick === 'function') {
        props.onClick();
      } else if (document.referrer.indexOf(window.location.origin) === 0) {
        props.history.push(document.referrer.slice(window.location.origin.length));
      } else if (props.location.state.prevPath) {
        props.history.push(props.location.state.prevPath);
      } else {
        props.history.push('/');
      }
    }}
  >
    <div className="close__inner">
      <div className="close__title">
        Close
      </div>
      <div className="close__icon">
        <IconClose />
      </div>
    </div>
  </div>
);

export default withRouter(Close);
