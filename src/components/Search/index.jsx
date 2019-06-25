import { KEY_ESCAPE } from 'keycode-js';
import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Popup from '../Popup';
import styles from './styles.css';
import debounce from '../../utils/debounce';
import api from '../../api';
import urls from '../../utils/urls';
import loader from '../../utils/loader';
import UserCardLine from '../UserCardLine';
import { getUserName } from '../../utils/user';
import Arrow from '../Icons/ArrowLeft';
import IconSearch from '../Icons/Search';
import IconClose from '../Icons/Close';
import IconDuck from '../Icons/Socials/Duck';

const SearchPopup = (props) => {
  const [usersData, setUsersData] = useState({ data: [], metadata: {} });
  const [userName, setUserName] = useState('');
  const page = 1;
  const sortBy = '-current_rate';
  const perPage = usersData.data.length || 10;
  const usersParams = {
    page, sortBy, perPage, userName,
  };

  const getData = async (params) => {
    loader.start();

    try {
      const data = await api.getUsers(params);
      setUsersData(data);
    } catch (e) {
      console.error(e);
    }

    loader.done();
  };

  const onChangeSearch = (userName) => {
    getData({
      ...usersParams, userName, page: 1, perPage: 10,
    });
  };
  const debouncedSetSearch = debounce(onChangeSearch, 500);

  useEffect(() => {
    if (userName !== undefined) {
      debouncedSetSearch(userName);
    }
  }, [userName]);

  const usersCount = usersData.data;
  const users = [...usersCount];
  users.splice(7);

  const duckLink = `https://duckduckgo.com/?q=${userName}&sites=u.community&ia=web`;

  return (
    <div className={styles.modal}>
      <div className={styles.search}>
        <div className={styles.inner}>
          <div className={styles.iconSearch}>
            <IconSearch />
          </div>
          <input
            autoFocus
            onChange={(e) => {
              setUserName(e.target.value);
              debouncedSetSearch(e.target.value);
            }}
            className={styles.input}
            placeholder="Search for people in U°OS blockchain…"
            type="text"
            spellCheck="false"
            onKeyUp={(e) => {
              if (props.onClickClose && e.keyCode === KEY_ESCAPE) {
                props.onClickClose();
              }
            }}
          />
          <div
            role="presentation"
            className={styles.iconClose}
            onClick={() => props.onClickClose && props.onClickClose()}
          >
            <IconClose />
          </div>
        </div>
      </div>

      {userName !== '' && (
        <Fragment>
          <Popup
            mod="search"
            onClickClose={() => props.onClickClose && props.onClickClose()}
          >
            <div className={styles.popup}>
              {users && users.length > 0 &&
                <div className={styles.column}>
                  <div className={styles.columnTitle}>Members</div>
                  {users && users.length > 0 &&
                    users.map(item => (
                      <div
                        role="presentation"
                        key={item.id}
                        onClick={() => props.onClickClose && props.onClickClose()}
                      >
                        <UserCardLine
                          key={item.id}
                          url={urls.getUserUrl(item.id)}
                          userPickSrc={urls.getFileUrl(item.avatarFilename)}
                          name={getUserName(item)}
                          accountName={item.accountName}
                          rate={item.scaledImportance}
                          sign="@"
                        />
                      </div>
                    ))
                  }
                  {usersCount.length > 7 &&
                    <Link to={`/users/?page=1&sortBy=-current_rate&perPage=20&userName=${userName}`} className={styles.viewAll}>
                      <div
                        role="presentation"
                        className={styles.viewAllText}
                        onClick={() => props.onClickClose && props.onClickClose()}
                      >
                        View all
                      </div>
                      <div className={styles.arrowRed}><Arrow /></div>
                    </Link>
                  }
                </div>
              }
              {users && users.length === 0 &&
                <div className={styles.notFound}>No Members Found</div>
              }
            </div>
          </Popup>
          <a href={duckLink} className={styles.footer} rel="noopener noreferrer" target="_blank">
            <div className={styles.searchLink}>Locate “{userName}” in posts and publications<span className={styles.iconDuck}><IconDuck /></span><span className={styles.arrowGrey}><Arrow /></span></div>
          </a>
        </Fragment>
      )}
    </div>
  );
};

SearchPopup.propTypes = {
  onClickClose: PropTypes.func,
};

SearchPopup.defaultProps = {
  onClickClose: undefined,
};

export default SearchPopup;
