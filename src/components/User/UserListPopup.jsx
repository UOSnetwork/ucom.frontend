import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import UserCard from '../UserCard';
import { UserFollowButton } from '../FollowButton';
import { selectUser } from '../../store/selectors/user';
import { getUsersByIds } from '../../store/users';
import { getUserName } from '../../utils/user';
import urls from '../../utils/urls';

// TODO: Remove
const UserListPopup = (props) => {
  if (!props.usersIds) {
    return null;
  }

  const users = getUsersByIds(props.users, props.usersIds);

  return (
    <div className="entry-list">
      <div className="entry-list__title">{props.title}</div>

      <div className="entry-list__list">
        {users.map(item => (
          <div className="entry-list__item" key={item.id}>
            <div className="entry-list__card">
              <UserCard
                className="user-card_text_left"
                userName={getUserName(item)}
                accountName={item.accountName}
                avatarUrl={urls.getFileUrl(item.avatarFilename)}
                profileLink={urls.getUserUrl(item.id)}
                sign={props.noSign ? '' : '@'}
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
  noSign: PropTypes.bool,
  usersIds: PropTypes.arrayOf(PropTypes.number),
};

UserListPopup.defaultTypes = {
  title: 'Followers',
};

export default connect(state => ({
  users: state.users,
  user: selectUser(state),
}))(UserListPopup);
