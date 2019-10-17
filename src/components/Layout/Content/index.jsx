import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Content = ({ children, isSmall }) => (
  <div
    className={classNames({
      [styles.content]: true,
      [styles.small]: isSmall,
    })}
  >
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
  isSmall: PropTypes.bool,
};

Content.defaultProps = {
  isSmall: false,
};

export default Content;
