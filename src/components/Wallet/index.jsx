import classNames from 'classnames';
import { throttle, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState, useCallback, memo } from 'react';
import styles from './styles.css';
import Popup, { Content } from '../Popup';
import Close from '../Close';
import AccountCard from './AccountCard';
import EmissionCard from './EmissionCard';
import Transactions from './Transactions';
import TokenCard, { Placeholder as TokenCardPlaceholder } from './TokenCard';
import Tabs from '../Tabs';
import Menu from '../Menu';
import Resources from './Resources';

export const TAB_WALLET_ID = 1;
export const TAB_RESOURCES_ID = 2;

const Wallet = ({
  accountCard,
  emissionCards,
  transactions,
  tokenCards,
  showTokenCardsPlaceholder,
  tabs,
  activeTabId,
  resources,
  onClickClose,
  onLoadMore,
  sidebarBlocked,
  menu,
}) => {
  const mainInnerRef = useRef(null);
  const layoutRef = useRef(null);
  const [mainInnerTop, setMainInnerTop] = useState(0);

  const calcAndSetMainInnerTop = () => {
    const mainInnerTop = mainInnerRef.current.offsetHeight - window.innerHeight;

    if (mainInnerTop > 0) {
      setMainInnerTop(-(mainInnerRef.current.offsetHeight - window.innerHeight));
    }
  };

  const onScroll = useCallback(throttle((container) => {
    if (onLoadMore && container.scrollTop + container.offsetHeight + 400 > layoutRef.current.offsetHeight) {
      onLoadMore();
    }
  }, 100), [layoutRef, onLoadMore]);

  useEffect(() => {
    calcAndSetMainInnerTop();
  }, [activeTabId, transactions]);

  useEffect(() => {
    calcAndSetMainInnerTop();
    window.addEventListener('resize', calcAndSetMainInnerTop);

    return () => {
      window.removeEventListener('resize', calcAndSetMainInnerTop);
    };
  }, []);

  return (
    <Popup
      alignTop
      onScroll={e => onScroll(e.target)}
    >
      <Content fullHeight fullWidth screen roundBorders={false}>
        <Close top right onClick={onClickClose} />

        <div className={styles.layout} ref={layoutRef}>
          <div className={styles.menu}>
            <Menu {...menu} />
          </div>
          <div className={styles.side}>
            <div
              className={classNames({
                [styles.inner]: true,
                [styles.blocked]: sidebarBlocked,
              })}
            >
              {emissionCards.length > 0 &&
                <div className={styles.emissionCards}>
                  {emissionCards.map((props, index) => (
                    <EmissionCard key={index} {...props} />
                  ))}
                </div>
              }

              <Transactions {...transactions} />
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.inner} ref={mainInnerRef} style={{ top: `${mainInnerTop}px` }}>
              <div className={styles.accountCard}>
                <AccountCard {...accountCard} />
              </div>

              <div className={styles.tabs}>
                <Tabs {...tabs} />
              </div>

              {activeTabId === TAB_WALLET_ID &&
                <Fragment>
                  {showTokenCardsPlaceholder ? <TokenCardPlaceholder /> : tokenCards.map((props, index) => <TokenCard key={index} {...props} />)}
                </Fragment>
              }

              {activeTabId === TAB_RESOURCES_ID &&
                <Resources {...resources} />
              }
            </div>
          </div>
        </div>
      </Content>
    </Popup>
  );
};

Wallet.propTypes = {
  accountCard: PropTypes.shape(AccountCard.propTypes),
  emissionCards: PropTypes.arrayOf(PropTypes.shape(EmissionCard.propTypes)),
  transactions: PropTypes.shape(Transactions.propTypes),
  tokenCards: PropTypes.arrayOf(PropTypes.shape(TokenCard.propTypes)),
  tabs: PropTypes.shape(Tabs.propTypes),
  activeTabId: PropTypes.oneOf([TAB_WALLET_ID, TAB_RESOURCES_ID]),
  resources: PropTypes.shape(Resources.propTypes),
  onClickClose: PropTypes.func,
  onLoadMore: PropTypes.func,
  sidebarBlocked: PropTypes.bool,
  menu: PropTypes.shape(Menu.propTypes),
  showTokenCardsPlaceholder: PropTypes.bool,
};

Wallet.defaultProps = {
  accountCard: AccountCard.defaultProps,
  emissionCards: [],
  transactions: Transactions.defaultProps,
  tokenCards: [],
  tabs: Tabs.defaultProps,
  activeTabId: TAB_WALLET_ID,
  resources: Resources.defaultProps,
  onClickClose: undefined,
  onLoadMore: undefined,
  sidebarBlocked: true,
  menu: Menu.defaultProps,
  showTokenCardsPlaceholder: false,
};

export * from './Actions';
export * from './wrappers';
export default memo(Wallet, isEqual);
