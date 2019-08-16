import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import React from 'react';
import styles from './styles.css';

const Loader = () => {
  const state = useSelector(state => state.loader, isEqual);

  return (
    <div
      className={classNames({
        [styles.loader]: true,
        [styles.start]: state.start,
        [styles.done]: state.done,
      })}
    >
      <span className={styles.progress} />
    </div>
  );
};

export default Loader;
