import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import LayoutBase from '../components/Layout/LayoutBase';
import { getUserName } from '../utils/user';
import urls from '../utils/urls';
import IconTableTriangle from '../components/Icons/TableTriangle';
import SearchInput from '../components/SearchInput';
import { formatScaledImportance } from '../utils/rate';
import graphql from '../api/graphql';
import withLoader from '../utils/withLoader';
import Pagination from '../components/Pagination/index';
import EntryCard from '../components/EntryCard';

const UsersPage = (props) => {
  const [usersData, setUsersData] = useState({ data: [], metadata: {} });
  const urlParams = new URLSearchParams(props.location.search);
  const page = urlParams.get('page') || 1;
  const sortBy = urlParams.get('sortBy') || '-scaled_importance';
  const perPage = urlParams.get('perPage') || 20;
  const userName = urlParams.get('userName') || '';

  const usersParams = {
    page, sortBy, perPage, userName,
  };

  const onChangePage = (page) => {
    props.history.push(urls.getUsersPagingUrl({ ...usersParams, page }));
    window.scrollTo(0, 'top');
  };

  const onChangeSearch = (userName) => {
    props.history.push(urls.getUsersPagingUrl({
      ...usersParams, userName, page: 1, perPage: 20,
    }));
  };

  const getData = async (params) => {
    try {
      const result = await withLoader(graphql.getUsers({
        page: Number(params.page),
        perPage: Number(params.perPage),
        orderBy: params.sortBy,
        filters: {
          usersIdentityPattern: params.userName,
        },
      }));

      setUsersData(result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData({
      page, perPage, sortBy, userName,
    });
  }, [props.location.search]);

  const { data: users } = usersData;
  const { hasMore, totalAmount } = usersData.metadata;

  return (
    <LayoutBase>
      <div className="layout layout_entries">
        <div className="layout__title">
          <h1 className="title title_bold">People</h1>
        </div>
        <div className="layout__search">
          <SearchInput setSearch={onChangeSearch} search={userName} />
        </div>
        <div className="layout__table">
          {users && users.length > 0 &&
            <div className="table-content table-content_big-bottom">
              <div className="table-content__table">
                <table className="list-table list-table_indexed list-table_users list-table_responsive">
                  <thead className="list-table__head">
                    <tr className="list-table__row">
                      <td className="list-table__cell list-table__cell_index">#</td>
                      {[{
                        title: 'Name',
                        name: 'account_name',
                        sortable: true,
                      }, {
                        title: 'Rate',
                        name: 'scaled_importance',
                        sortable: true,
                      }].map(item => (
                        <td
                          key={item.name}
                          role="presentation"
                          className={classNames(
                            'list-table__cell',
                            { 'list-table__cell_sortable': item.sortable },
                          )}
                        >
                          <Link to={urls.getUsersPagingUrl({ ...usersParams, sortBy: `${sortBy === `-${item.name}` ? '' : '-'}${item.name}` })}>
                            <div className="list-table__title">
                              {item.title}

                              {sortBy === `-${item.name}` && (
                                <div className="list-table__sort-icon">
                                  <IconTableTriangle />
                                </div>
                              )}

                              {sortBy === `${item.name}` && (
                                <div className="list-table__sort-icon list-table__sort-icon_flip">
                                  <IconTableTriangle />
                                </div>
                              )}
                            </div>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="list-table__body">
                    {users.map((item, index) => (
                      <tr className="list-table__row" key={item.id}>
                        <td className="list-table__cell list-table__cell_index">{index + 1 + ((page - 1) * perPage) }</td>
                        <td className="list-table__cell list-table__cell_name" data-title="Name">
                          <EntryCard
                            avatarSrc={urls.getFileUrl(item.avatarFilename)}
                            url={urls.getUserUrl(item.id)}
                            title={getUserName(item)}
                            nickname={item.accountName}
                            disableRate
                          />
                        </td>
                        <td className="list-table__cell" data-title="Rate">
                          <span className="title title_xsmall title_light">{formatScaledImportance(item.scaledImportance)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-content__navbar">
                {hasMore && (
                  <div className="table-content__showmore">
                    <div className="button-clean button-clean_link">
                      <Link to={urls.getUsersPagingUrl({ ...usersParams, perPage: +perPage + 20 })}>Show More</Link>
                    </div>
                  </div>
                )}

                <Pagination
                  page={Number(page)}
                  perPage={Number(perPage)}
                  totalAmount={Number(totalAmount)}
                  onChange={onChangePage}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </LayoutBase>
  );
};

UsersPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default UsersPage;
