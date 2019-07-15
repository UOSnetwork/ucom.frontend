import { defer } from 'lodash';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Result from './Result';
import styles from './styles.css';

const Content = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    defer(() => {
      setActive(true);
    });
  });

  return (
    <div
      className={classNames({
        [styles.content]: true,
        [styles.active]: active,
      })}
    >
      <Result />
      <Footer />
    </div>
  );
};

export default Content;
