import { useSelector } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { UserCard } from '../EntryCard';
import { UserFollowButton } from '../FollowButton';
import { selectUsersByIds } from '../../store';

// TODO: Remove
const UserListPopup = ({ title, usersIds }) => {
  if (!usersIds) {
    return null;
  }

  const users = useSelector(selectUsersByIds(usersIds));

  return (
    <div className="entry-list">
      <div className="entry-list__title">{title}</div>

      <div className="entry-list__list">
        {users.map(item => (
          <div className="entry-list__item" key={item.id}>
            <div className="entry-list__card">
              <UserCard
                disableRate
                userId={item.id}
              />
            </div>

            {item.id &&
              <div className="entry-list__follow">
                <UserFollowButton userId={item.id} />
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

UserListPopup.propTypes = {
  title: PropTypes.string,
  usersIds: PropTypes.arrayOf(PropTypes.number),
};

UserListPopup.defaultProps = {
  title: 'Followers',
  usersIds: [],
};

export default UserListPopup;
