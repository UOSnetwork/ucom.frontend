import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import styles from './styles.css';
import Popup, { Content } from '../Popup';
import Close from '../Close';
import AccountCard from './AccountCard';
import EmissionCard from './EmissionCard';
import Transactions from './Transactions';
import TokenCard from './TokenCard';
import Tabs from '../Tabs';
import Resource from './Resource';

export const TAB_WALLET_ID = 1;
export const TAB_RESOURCES_ID = 2;

const Wallet = ({
  accountCard, emissionCards, transactions, tokenCards, tabs, activeTabId, ramResource, cpuTimeResource, networkBandwithResource, onClickClose, onLoadMore,
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
      <Content fullHeight fullWidth screen>
        <Close top right onClick={onClickClose} />

        <div className={styles.layout} ref={layoutRef}>
          <div className={styles.side}>
            <div className={styles.inner}>
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
                  {tokenCards.map((props, index) => <TokenCard key={index} {...props} />)}
                </Fragment>
              }

              {activeTabId === TAB_RESOURCES_ID &&
                <Fragment>
                  {ramResource &&
                    <Fragment>
                      <div className={styles.label}>Resources you own</div>
                      {ramResource && <Resource {...ramResource} />}
                    </Fragment>
                  }

                  {(cpuTimeResource || networkBandwithResource) &&
                    <Fragment>
                      <div className={styles.label}>Resources you staked for</div>
                      {cpuTimeResource && <Resource {...cpuTimeResource} />}
                      {networkBandwithResource && <Resource {...networkBandwithResource} />}
                    </Fragment>
                  }
                </Fragment>
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
  ramResource: PropTypes.shape(Resource.propTypes),
  cpuTimeResource: PropTypes.shape(Resource.propTypes),
  networkBandwithResource: PropTypes.shape(Resource.propTypes),
  onClickClose: PropTypes.func,
  onLoadMore: PropTypes.func,
};

Wallet.defaultProps = {
  accountCard: AccountCard.defaultProps,
  emissionCards: [],
  transactions: Transactions.defaultProps,
  tokenCards: [],
  tabs: Tabs.defaultProps,
  activeTabId: TAB_WALLET_ID,
  ramResource: Resource.defaultProps,
  cpuTimeResource: Resource.defaultProps,
  networkBandwithResource: Resource.defaultProps,
  onClickClose: undefined,
  onLoadMore: undefined,
};

export * from './wrappers';
export default Wallet;
