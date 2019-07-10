import classNames from 'classnames';
import { throttle } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import React, { Fragment, useState, useEffect } from 'react';
import styles from './styles.css';
import Logo from '../Logo/Logo';
import urls from '../../utils/urls';
import IconWallet from '../Icons/Wallet';
import IconBell from '../Icons/Bell';
import User from './User';
import { authShowPopup } from '../../actions/auth';
import EntryListPopup from '../EntryListPopup';
import IconSearch from '../Icons/Search';
import Wallet from '../Wallet';
import IconClose from '../Icons/Close';
import SiteNotificationsTooltip from '../SiteNotificationsTooltip';
import Counter from '../Counter';
import Search from '../Search';
import Menu from '../Menu';
import { selectOwner } from '../../store/selectors';

const Header = ({ location }) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const [walletPopupVisible, setWalletPopupVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [organizationsPopupVisible, setOrganizationsPopupVisible] = useState(false);

  const checkScroll = throttle(() => {
    setIsScroll(window.top.scrollY > 0);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <Fragment>
      <div
        className={classNames({
          [styles.header]: true,
          [styles.isScroll]: isScroll,
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
              onClick={() => setSearchVisible(true)}
            >
              <IconSearch />
            </div>
          </div>

          <div className={`${styles.section} ${styles.flat}`}>
            {owner.id ? (
              <Fragment>
                <User onClickOrganizationsViewAll={() => setOrganizationsPopupVisible(true)} />

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
                  {walletPopupVisible ? <IconClose /> : <IconWallet />}
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
          data={owner.organizations.map(item => ({
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

      {searchVisible &&
        <Search onClickClose={() => setSearchVisible(false)} />
      }
    </Fragment>
  );
};

export default withRouter(Header);
