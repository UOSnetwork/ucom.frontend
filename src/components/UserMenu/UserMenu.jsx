// TODO: Remove file and all deps
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { KEY_ESCAPE } from 'keycode-js';
import { selectUser } from '../../store/selectors';
import { removeUser } from '../../actions';
import { showMenuPopup, hideMenuPopup } from '../../actions/menuPopup';
import Popup from '../Popup';
import LogoutIcon from '../Icons/Logout';
import IconSearch from '../Icons/Search';
import MenuWallet from '../Wallet/MenuWallet';
import WalletActivity from '../Wallet/WalletActivity';
import { removeToken } from '../../utils/token';
import urls from '../../utils/urls';
import SearchPopup from '../Search';

const UserMenu = (props) => {
  const logout = () => {
    removeToken();
    props.removeUser();
    window.location.reload();
    props.hideMenuPopup();
  };

  const [search, showSearch] = useState(false);

  return (
    <Fragment>
      {props.menuPopupVisibility &&
        <Popup mod="user-menu">
          <div className="user-menu">
            <div className="user-menu__content">
              <div className="content">
                <div className="content__inner content__inner_grid">
                  <div className="user-menu__side">
                    <div className="menu menu_vertical menu_fixed-width">
                      <div
                        className="menu__item  menu__item_search else-desktop"
                        role="presentation"
                        onClick={() => {
                          showSearch(!search);
                          return props.menuPopupVisibility ? props.hideMenuPopup() : null;
                        }}
                      >
                        <div className="menu__item-search-icon">
                          <IconSearch />
                        </div>  Search for…
                      </div>
                      <div className="menu__item else-desktop">
                        <NavLink
                          to="/users"
                          className="menu__link menu__link_upper"
                          // activeClassName="menu__link_active"
                          // isActive={() => props.location.pathname === '/users'}
                        >
                          People
                        </NavLink>
                      </div>
                      <div className="menu__item else-desktop">
                        <NavLink
                          to={urls.getOverviewCategoryUrl()}
                          className="menu__link menu__link_upper"
                          // activeClassName="menu__link_active"
                          // isActive={() => props.location.pathname.indexOf('/publications') === 0}
                        >
                          Overview
                        </NavLink>
                      </div>

                      <div className="menu__item else-desktop">
                        <NavLink
                          to={urls.getGovernanceUrl()}
                          className="menu__link menu__link_upper"
                          // activeClassName="menu__link_active"
                          // isActive={() => props.location.pathname.indexOf(urls.getGovernanceUrl()) === 0}
                        >
                          Governance
                        </NavLink>
                      </div>

                      {props.user.id &&
                        <div className="menu__item">
                          <div
                            className="menu__link menu__link_upper menu__link_active"
                          >
                            Wallet
                          </div>
                        </div>
                      }

                      {props.user.id &&
                        <div className="menu__item">
                          <span
                            role="presentation"
                            className="menu__link menu__link_upper"
                            onClick={() => {
                              props.hideMenuPopup();
                              props.settingsShow();
                            }}
                          >
                            Settings
                          </span>
                        </div>
                      }

                      {props.user.id &&
                        <div className="menu__item">
                          <span className="menu__link menu__logout menu__link_upper" role="presentation" onClick={logout}>
                            <span className="inline inline_small">
                              <span className="inline__item">Log out</span>
                              <span className="inline__item "><LogoutIcon /></span>
                            </span>
                          </span>
                        </div>
                      }
                    </div>
                  </div>
                  <div>
                    {props.user.id && <MenuWallet />}
                    {props.user.id && <WalletActivity />}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </Popup>
      }
      {search && (
        <SearchPopup
          userMenu
          onClickClose={() => showSearch(!search)}
          onKeyDown={(e) => {
            if (e.keyCode === KEY_ESCAPE) {
              showSearch(!search);
              props.showMenuPopup();
            }
          }}
        />
      )}
    </Fragment>
  );
};

UserMenu.propTypes = {
  menuPopupVisibility: PropTypes.bool,
  removeUser: PropTypes.func.isRequired,
  showMenuPopup: PropTypes.func.isRequired,
  hideMenuPopup: PropTypes.func.isRequired,
  settingsShow: PropTypes.func.isRequired,
};

UserMenu.defaultProps = {
  menuPopupVisibility: false,
};

export default withRouter(connect(
  state => ({
    menuPopupVisibility: state.menuPopup.menuPopupVisibility,
    user: selectUser(state),
    wallet: state.wallet,
  }),
  dispatch => bindActionCreators({
    showMenuPopup,
    hideMenuPopup,
    removeUser,
    settingsShow,
  }, dispatch),
)(UserMenu));
