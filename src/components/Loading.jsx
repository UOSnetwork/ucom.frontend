import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const LoadingScreen = props => (
  <CSSTransition
    appear={props.appear}
    in={props.loading}
    timeout={300}
    classNames="loading"
    unmountOnExit
  >
    <div className={classNames('loading', props.className)} />
  </CSSTransition>
);

LoadingScreen.propTypes = {
  loading: PropTypes.bool,
  appear: PropTypes.bool,
  className: PropTypes.string,
};

LoadingScreen.defaultProps = {
  loading: false,
  appear: false,
  className: undefined,
};

export default LoadingScreen;
