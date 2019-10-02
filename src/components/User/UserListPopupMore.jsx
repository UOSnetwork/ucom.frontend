import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserCard } from '../EntryCard';
import Rate from '../Rate';
import { UserFollowButton } from '../FollowButton';
import api from '../../api';
import loader from '../../utils/loader';
import LoadMore from '../Feed/LoadMore';
import { formatScaledImportance } from '../../utils/rate';

const UserListPopupMore = (props) => {
  if (!props.tagTitle) {
    return null;
  }

  const [users, setUsers] = useState([]);
  const [lastUserId, setlastUserId] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUsers = async ({ perPage, page, lastUserId }) => {
    loader.start();
    setLoading(true);

    try {
      const params = {
        page,
        perPage,
        tagTitle: props.tagTitle,
        lastId: lastUserId,
      };
      const data = await api.getTagUsers(params);
      setUsers(page === 1 ? data.data : users.concat(data.data));
      setMetadata(data.metadata);
      const lastId = data.data[data.data.length - 1];
      setlastUserId(lastId.id);
    } catch (e) {
      console.error(e);
    }

    loader.done();
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers({ page: 1, perPage: 10, lastUserId });
  }, [props.userId, props.organizationId, props.tagTitle]);

  return (
    <div className="entry-list">
      <div className="entry-list__title">{props.title}</div>

      <div className="entry-list__list">
        {users.map(item => (
          <div className="entry-list__item" key={item.id}>
            <div className="entry-list__card">
              <UserCard disableRate userId={item.id} />
            </div>

            <div className="entry-list__rate">
              <Rate
                disableRateFormat
                value={formatScaledImportance(item.scaledImportance)}
                className="rate_small"
              />
            </div>

            {item.id &&
              <div className="entry-list__follow">
                <UserFollowButton userId={item.id} />
              </div>
            }
          </div>
        ))}

        {metadata.hasMore &&
          <div className="feed__loadmore">
            <LoadMore
              disabled={loading}
              onClick={() => {
                if (loading) return;

                fetchUsers({
                  page: metadata.page + 1,
                  perPage: metadata.perPage,
                  lastUserId,
                });
              }}
            />
          </div>
        }
      </div>
    </div>
  );
};

UserListPopupMore.propTypes = {
  title: PropTypes.string,
  tagTitle: PropTypes.string,
  userId: PropTypes.number,
  organizationId: PropTypes.number,
};

UserListPopupMore.defaultProps = {
  title: 'Followers',
  tagTitle: undefined,
  userId: undefined,
  organizationId: undefined,
};

export default UserListPopupMore;
