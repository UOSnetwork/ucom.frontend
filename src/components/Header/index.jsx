import classNames from 'classnames';
import { throttle, isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import React, { Fragment, useState, useEffect, useCallback, useRef, memo } from 'react';
import styles from './styles.css';
import Logo from '../Logo/Logo';
import urls from '../../utils/urls';
import IconWallet from '../Icons/Wallet';
import IconBurger from '../Icons/Burger';
import IconBell from '../Icons/Bell';
import User from './User';
import { authShowPopup } from '../../actions/auth';
import * as searchPopupActions from '../../actions/searchPopup';
import EntryListPopup from '../EntryListPopup';
import IconSearch from '../Icons/Search';
import Wallet from '../Wallet';
import IconClose from '../Icons/Close';
import SiteNotificationsTooltip from '../SiteNotificationsTooltip';
import Counter from '../Counter';
import Menu from '../Menu';
import { selectOwner, selectOrgsByIds } from '../../store/selectors';

// TODO: Make header sticky, not fixed

const Header = ({ location }) => {
  const elRef = useRef();
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const orgs = useSelector(selectOrgsByIds(owner.organizations), isEqual);
  const ieobanner = useSelector(state => state.ieobanner, isEqual);
  const [walletPopupVisible, setWalletPopupVisible] = useState(false);
  const [organizationsPopupVisible, setOrganizationsPopupVisible] = useState(false);

  const checkScroll = throttle(() => {
    if (window.top.scrollY > 0 && elRef.current) {
      elRef.current.classList.add(styles.isScroll);
    } else {
      elRef.current.classList.remove(styles.isScroll);
    }
  }, 100);

  const showOrgsPopup = useCallback(() => {
    setOrganizationsPopupVisible(true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [elRef]);

  return (
    <Fragment>
      <div
        ref={elRef}
        className={classNames({
          [styles.header]: true,
          [styles.ieobanner]: ieobanner.visible,
        })}
      >
        <div className={styles.inner}>
          <div className={styles.section}>
            <Link to={urls.getMainPageUrl()}>
              <Logo />
            </Link>

            <div className={styles.menu}>
              <Menu
                items={[{
                  to: urls.getUsersUrl(),
                  isActive: () => location.pathname === urls.getUsersUrl(),
                  title: 'People',
                }, {
                  to: urls.getOverviewCategoryUrl(),
                  isActive: () => location.pathname.indexOf(urls.getOverviewCategoryUrl()) === 0,
                  title: 'Overview',
                }, {
                  to: urls.getGovernanceUrl(),
                  isActive: () => location.pathname.indexOf(urls.getGovernanceUrl()) === 0,
                  title: 'Governance',
                }]}
              />
            </div>

            <div
              role="presentation"
              className={`${styles.icon} ${styles.search}`}
              onClick={() => dispatch(searchPopupActions.show())}
            >
              <IconSearch />
            </div>
          </div>

          <div className={`${styles.section} ${styles.flat}`}>
            {owner.id ? (
              <Fragment>
                <User onClickOrganizationsViewAll={showOrgsPopup} />

                <SiteNotificationsTooltip>
                  {({ toggleTooltip, unreadNotifications, tooltipVisibilty }) => (
                    <span
                      role="presentation"
                      className={classNames({
                        [styles.icon]: true,
                        [styles.active]: tooltipVisibilty,
                      })}
                      onClick={toggleTooltip}
                    >
                      <IconBell />

                      {unreadNotifications > 0 &&
                        <div className={styles.counter}>
                          <Counter>{unreadNotifications}</Counter>
                        </div>
                      }
                    </span>
                  )}
                </SiteNotificationsTooltip>

                <span
                  role="presentation"
                  className={classNames({
                    [styles.icon]: true,
                    [styles.wallet]: true,
                    [styles.active]: walletPopupVisible,
                  })}
                  onClick={() => setWalletPopupVisible(!walletPopupVisible)}
                >
                  {walletPopupVisible ? (
                    <IconClose />
                  ) : (
                    <Fragment>
                      <span className={styles.iconWallet}><IconWallet /></span>
                      <span className={styles.iconBurger}><IconBurger /></span>
                    </Fragment>
                  )}
                </span>
              </Fragment>
            ) : (
              <Menu
                items={[{
                  title: 'Sign IN',
                  onClick: () => dispatch(authShowPopup()),
                }]}
              />
            )}
          </div>
        </div>
      </div>

      {organizationsPopupVisible &&
        <EntryListPopup
          title="My communities"
          data={orgs.map(item => ({
            id: item.id,
            follow: false,
            organization: true,
            avatarSrc: urls.getFileUrl(item.avatarFilename),
            url: urls.getOrganizationUrl(item.id),
            title: item.title,
            nickname: item.nickname,
            currentRate: item.currentRate,
          }))}
          onClickClose={() => setOrganizationsPopupVisible(false)}
        />
      }

      {walletPopupVisible &&
        <Wallet onClickClose={() => setWalletPopupVisible(false)} />
      }
    </Fragment>
  );
};

export default memo(withRouter(Header));
