// TODO: Move to pages/home
import { useTranslation } from 'react-i18next';
import { range } from 'lodash';
import Tippy from '@tippy.js/react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import styles from './styles.css';

export const TAB_ID_COMMUNITIES = 1;
export const TAB_ID_PEOPLE = 2;
export const TAB_ID_ALL = 3;
export const TAB_ID_OFFERS = 4;


const Tabs = ({ activeTabId, onClickItem }) => {
  const { t } = useTranslation();

  const tabs = [{
    id: TAB_ID_COMMUNITIES,
    title: t('Communities'),
    disabled: false,
  }, {
    id: TAB_ID_PEOPLE,
    title: t('People'),
    disabled: false,
  }, {
    id: TAB_ID_ALL,
    title: t('All'),
    disabled: true,
  }, {
    id: TAB_ID_OFFERS,
    title: t('Offers'),
    disabled: true,
  }];

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {tabs.map(item => (
          <div
            key={item.id}
            className={classNames({
              [styles.item]: true,
              [styles.active]: activeTabId === item.id,
            })}
          >
            <span className={styles.inner}>
              <span className={styles.left}>{range(5).map(() => ` ${item.title}`)}&nbsp;</span>
              {item.title}
              <span className={styles.right}>&nbsp;{range(5).map(() => `${item.title} `)}</span>
            </span>
          </div>
        ))}
      </div>

      <div className={styles.tabs}>
        {tabs.map(item => (
          <div
            key={item.id}
            className={classNames({
              [styles.item]: true,
              [styles.offers]: item.id === TAB_ID_OFFERS,
              [styles.active]: activeTabId === item.id,
              [styles.disabled]: item.disabled,
            })}
          >
            <span
              role="presentation"
              className={styles.link}
              onClick={() => !item.disabled && onClickItem(item.id)}
            >
              <Tippy
                arrow
                isEnabled={item.disabled}
                placement="top"
                content={t('Coming Soon')}
              >
                <span className={styles.text}>{item.title}</span>
              </Tippy>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  activeTabId: PropTypes.oneOf([
    TAB_ID_COMMUNITIES,
    TAB_ID_PEOPLE,
    TAB_ID_ALL,
    TAB_ID_OFFERS,
  ]),
  onClickItem: PropTypes.func.isRequired,
};

Tabs.defaultProps = {
  activeTabId: TAB_ID_PEOPLE,
};

export default Tabs;
