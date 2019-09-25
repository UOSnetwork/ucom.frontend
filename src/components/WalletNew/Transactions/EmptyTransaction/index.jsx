import { random } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const EmptyTransaction = ({ circlePick }) => (
  <div className={styles.emptyTransaction}>
    <div
      className={classNames({
        [styles.pick]: true,
        [styles.circle]: circlePick,
      })}
    />

    <div className={styles.content}>
      <span className={styles.block} style={{ width: `${random(70, 150)}px` }} />
    </div>
    <div className={styles.amount}>
      <span className={styles.block} style={{ width: `${random(64, 79)}px` }} />
    </div>
  </div>
);

EmptyTransaction.propTypes = {
  circlePick: PropTypes.bool,
};

EmptyTransaction.defaultProps = {
  circlePick: false,
};

export default EmptyTransaction;
