import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';
import Tokens from '../Resources/Tokens';
import Transfers from '../Resources/Transfers';
import styles from './styles.css';
import urls from '../../utils/urls';
import Menu from '../Menu';
import ReferralBanner from '../ReferralBanner';
import { logout } from '../../utils/auth';
import * as searchPopup from '../../actions/searchPopup';
import Popup, { Content } from '../Popup';

const Wallet = ({ location, onClickClose }) => {
  const dispatch = useDispatch();

  return (
    <Popup
      transparent
      mod="wallet"
      onClickClose={onClickClose}
    >
      <Content
        screen
        fullHeight
        fullWidth
        roundBorders={false}
      >
        <div className={styles.wallet}>
          <div className={`${styles.section} ${styles.menu}`}>
            <Menu
              items={[{
                title: 'Search',
                onClick: () => {
                  onClickClose();
                  dispatch(searchPopup.show());
                },
              }, {
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
              }, {
                title: 'Settings',
                href: urls.getSettingsUrl(),
              }, {
                title: 'Log Out',
                onClick: () => logout(),
              }]}
            />
          </div>
          <div className={styles.section}>
            <h2 className={styles.title}>Wallet</h2>
            <Tokens />
          </div>
          <div className={`${styles.section} ${styles.wide}`}>
            <ReferralBanner />
          </div>
          <div className={styles.section}>
            <h2 className={styles.title}>Transfers</h2>
            <Transfers />
          </div>
        </div>
      </Content>
    </Popup>
  );
};

Wallet.propTypes = {
  onClickClose: PropTypes.func.isRequired,
};

export default withRouter(Wallet);
