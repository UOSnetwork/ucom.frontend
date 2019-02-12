import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Pagination from 'rc-pagination';
import UserCard from '../components/UserCard';
import LayoutBase from '../components/Layout/LayoutBase';
import api from '../api';
import { getUserName } from '../utils/user';
import urls from '../utils/urls';
import IconTableTriangle from '../components/Icons/TableTriangle';
import SearchInput from '../components/SearchInput';
import { getFileUrl } from '../utils/upload';
import loader from '../utils/loader';

const { getPagingLink } = urls;

const textItemRender = (current, type, element) => {
  if (type === 'prev') {
    return <a>Prev</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return element;
};

const UsersPage = (props) => {
  const [usersData, setUsersData] = useState({ data: [], metadata: {} });
  const urlParams = new URLSearchParams(props.location.search);
  const page = urlParams.get('page') || 1;
  const sortBy = urlParams.get('sortBy') || '-current_rate';
  const perPage = urlParams.get('perPage') || 20;
  const userName = urlParams.get('userName') || '';

  const usersParams = {
    page, sortBy, perPage, userName,
  };

  const onChangePage = (current) => {
    props.history.push(getPagingLink({ ...usersParams, page: current }));
    window.scrollTo(0, 'top');
  };

  const onChangeSearch = (userName) => {
    props.history.push(getPagingLink({
      ...usersParams, userName, page: 1, perPage: 20,
    }));
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

  useEffect(() => {
    getData({
      page, perPage, sortBy, userName,
    });
  }, [props.location.search]);

  const { data: users } = usersData;
  const { hasMore, totalAmount } = usersData.metadata;

  return (
    <LayoutBase>
      <div className="content">
        <div className="content__inner">
          <div className="content__title content__title_narrow content__title_searched">
            <h1 className="title">People</h1>
            <SearchInput setSearch={onChangeSearch} search={userName} />
          </div>
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
                        name: 'current_rate',
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
                          <Link to={getPagingLink({ ...usersParams, sortBy: `${sortBy === `-${item.name}` ? '' : '-'}${item.name}` })}>
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
                        <td className="list-table__cell list-table__cell_index">{index + 1 + ((page - 1) * perPage)}</td>
                        <td className="list-table__cell list-table__cell_name" data-title="Name">
                          <UserCard
                            profileLink={urls.getUserUrl(item.id)}
                            avatarUrl={getFileUrl(item.avatarFilename)}
                            userName={getUserName(item)}
                            accountName={item.accountName}
                            sign="@"
                          />
                        </td>
                        <td className="list-table__cell" data-title="Rate">
                          <span className="title title_xsmall title_light">{(+item.currentRate).toLocaleString()}°</span>
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
                      <Link to={getPagingLink({ ...usersParams, perPage: +perPage + 20 })}>Show More</Link>
                    </div>
                  </div>
                )}
                <Pagination
                  className="table-content__pagination"
                  showTitle={false}
                  total={totalAmount}
                  pageSize={+perPage}
                  itemRender={textItemRender}
                  current={+page}
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

export default UsersPage;
