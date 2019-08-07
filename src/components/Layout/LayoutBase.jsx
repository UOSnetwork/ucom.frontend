import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import Header from '../Header';
import styles from './styles.css';

const LayoutBase = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      <Header />

      <div className={styles.content}>
        {props.children}
      </div>
    </Fragment>
  );
};

LayoutBase.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutBase;
