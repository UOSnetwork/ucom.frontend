import { useTranslation } from 'react-i18next';
import { endsWith, clamp, debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutBase, Content } from '../../components/Layout';
import TextInput from '../../components/TextInput';
import { TableUsers } from '../../components/Table';
import * as usersPageActions from '../../actions/pages/users';
import withLoader from '../../utils/withLoader';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import IconSearch from '../../components/Icons/Search';
import IconClose from '../../components/Icons/Close';
import urls from '../../utils/urls';
import styles from './styles.css';

const Users = ({ location, history }) => {
  const { t } = useTranslation();
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(location.search);

    return {
      page: urlParams.get('page') || 1,
      perPage: clamp(urlParams.get('perPage') || 20, 50),
      orderBy: urlParams.get('orderBy') || '-current_rate',
      userName: urlParams.get('userName') || '',
    };
  };

  const urlParams = getUrlParams();
  const { page, perPage, orderBy } = urlParams;
  const [userName, setUserName] = useState(urlParams.userName);
  const state = useSelector(state => state.pages.users);
  const dispatch = useDispatch();


  const getData = async (page, perPage, orderBy, userName, append) => {
    try {
      await withLoader(dispatch(usersPageActions.getUsers(page, perPage, orderBy, userName, append)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const changePage = (page, perPage, orderBy, userName) => {
    history.push(urls.getUsersPagingUrl({
      page, perPage, orderBy, userName,
    }));
  };

  const changePageDebounce = useMemo(() => debounce(changePage, 500), []);

  useEffect(() => {
    const urlParams = getUrlParams();
    getData(urlParams.page, urlParams.perPage, urlParams.orderBy, urlParams.userName);
    setUserName(urlParams.userName);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => (
    () => {
      dispatch(usersPageActions.reset());
    }
  ), []);

  return (
    <LayoutBase>
      <Content>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('People')}</h1>
          <div className={styles.search}>
            <TextInput
              placeholder={t('Search')}
              icon={userName ? <IconClose /> : <IconSearch />}
              value={userName}
              onChange={(value) => {
                setUserName(value);
                changePageDebounce(
                  1,
                  perPage,
                  orderBy,
                  value,
                );
              }}
              onClickIcon={userName ? () => {
                setUserName('');
                changePage(
                  1,
                  perPage,
                  orderBy,
                  '',
                );
              } : undefined}
            />
          </div>
        </div>
        <div className={styles.table}>
          <TableUsers
            startIndex={Number(((page - 1) * perPage) + 1)}
            userIds={state.ids}
            orderBy={orderBy}
            onSort={(col) => {
              changePage(
                page,
                perPage,
                endsWith(orderBy, col.name) ? col.reverse ? `-${col.name}` : col.name : `-${col.name}`,
                userName,
              );
            }}
          />
        </div>

        <Pagination
          {...state.metadata}
          onClickShowMore={() => {
            getData(
              state.metadata.page + 1,
              perPage,
              orderBy,
              userName,
              true,
            );
          }}
          onChange={(page) => {
            changePage(
              page,
              perPage,
              orderBy,
              userName,
            );
          }}
        />

        <Footer />
      </Content>
    </LayoutBase>
  );
};

Users.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Users;
