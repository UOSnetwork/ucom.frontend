import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import formatNumber from '../../../../utils/formatNumber';
import styles from './styles.css';

export const TAB_ID_ALL = 1;
export const TAB_ID_UP = 2;
export const TAB_ID_DOWN = 3;

const Tabs = ({
  count, upCount, downCount, activeTabId, onClickTab,
}) => (
  <div className={styles.tabs}>
    <div className={styles.inner}>
      {[{
        id: TAB_ID_ALL,
        title: `All (${formatNumber(count)})`,
      }, {
        id: TAB_ID_UP,
        title: `${formatNumber(upCount)} Up`,
      }, {
        id: TAB_ID_DOWN,
        title: `${formatNumber(downCount)} Down`,
      }].map(({ id, title }) => (
        <span
          key={id}
          role="presentation"
          onClick={() => onClickTab && onClickTab(id)}
          className={classNames({
            [styles.tab]: true,
            [styles.active]: activeTabId === id,
          })}
        >
          {title}
        </span>
      ))}
    </div>
  </div>
);

Tabs.propTypes = {
  count: PropTypes.number,
  upCount: PropTypes.number,
  downCount: PropTypes.number,
  activeTabId: PropTypes.number,
  onClickTab: PropTypes.func,
};

Tabs.defaultProps = {
  count: 0,
  upCount: 0,
  downCount: 0,
  activeTabId: TAB_ID_ALL,
  onClickTab: undefined,
};

export default memo(Tabs);
