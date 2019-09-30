import { random, range } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styles from './styles.css';

const ITEMS_COUNT = 20;
const contentWiths = range(ITEMS_COUNT).map(() => random(70, 150));
const amountWiths = range(ITEMS_COUNT).map(() => random(64, 79));

const Item = ({ circlePick, contentWith, amountWidth }) => (
  <div className={styles.emptyTransaction}>
    <div
      className={classNames({
        [styles.pick]: true,
        [styles.circle]: circlePick,
      })}
    />

    <div className={styles.content}>
      <span className={styles.block} style={{ width: `${contentWith}px` }} />
    </div>
    <div className={styles.amount}>
      <span className={styles.block} style={{ width: `${amountWidth}px` }} />
    </div>
  </div>
);

Item.propTypes = {
  circlePick: PropTypes.bool,
  contentWith: PropTypes.number.isRequired,
  amountWidth: PropTypes.number.isRequired,
};

Item.defaultProps = {
  circlePick: false,
};

const Placeholder = () => (
  <Fragment>
    {range(ITEMS_COUNT).map(i => (
      <Item
        key={i}
        circlePick={Boolean(i % 2)}
        contentWith={contentWiths[i]}
        amountWidth={amountWiths[i]}
      />
    ))}
  </Fragment>
);

export default Placeholder;
