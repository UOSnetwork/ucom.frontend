import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../EntryHeader/styles.css';
import { getUserById, getUsersByIds } from '../../../store/users';
import Avatar from '../../EntryHeader/Avatar';
import urls from '../../../utils/urls';
import { updateUser, addUsers } from '../../../actions/users';
import { getUserName, userIsOwner, mapUserDataToFollowersProps } from '../../../utils/user';
import UserStatus from '../UserStatus';
import { formatScaledImportance } from '../../../utils/rate';
import UserFollowButton from '../UserFollowButton';
import Followers, { followersPropTypes } from '../../Followers';
import ButtonEdit from '../../ButtonEdit';
import Menu from '../../EntryHeader/Menu';

const UserHead = (props) => {
  const user = getUserById(props.users, props.userId);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.entryHead}>
      {userIsOwner(user, props.owner) &&
        <div className={styles.edit}>
          <ButtonEdit strech url={urls.getUserEditProfileUrl(user.id)} />
        </div>
      }

      <Menu />

      <div className={styles.main}>
        <div className={styles.avatar}>
          <Avatar
            src={urls.getFileUrl(user.avatarFilename)}
            changeEnabled={userIsOwner(user, props.owner)}
            onChange={async (file) => {
              props.dispatch(addUsers([{
                id: +props.owner.id,
                avatarFilename: file.preview,
              }]));

              props.dispatch(updateUser({
                avatarFilename: file,
              }));
            }}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.accountName}>@{user.accountName}</div>
          <div className={styles.userName}>{getUserName(user)}</div>
          <div className={styles.status}>
            <UserStatus userId={user.id} />
          </div>
        </div>

        <div className={styles.rate}>{formatScaledImportance(user.scaledImportance)}</div>
      </div>

      <div className={styles.side}>
        {!userIsOwner(user, props.owner) &&
          <div className={styles.followButton}>
            <UserFollowButton userId={+user.id} />
          </div>
        }

        <div className={styles.usersLists}>
          {user.followedBy &&
            <div>
              <Followers
                title="Followers"
                count={user.followedBy.length}
                users={getUsersByIds(props.users, user.followedBy)
                  .map(mapUserDataToFollowersProps)}
              />
            </div>
          }
          {user.iFollow &&
            <div>
              <Followers
                title="Following"
                count={user.iFollow.length}
                users={getUsersByIds(props.users, user.iFollow)
                  .map(mapUserDataToFollowersProps)}
              />
            </div>
          }
          {user.followedBy &&
            <div>
              <Followers
                title="Trusted by"
                count={props.trustedByUsersCount}
                users={getUsersByIds(props.users, props.trustedByUsersIds).map(mapUserDataToFollowersProps)}
                metadata={props.trustedByMetadata}
                onChangePage={props.trustedByOnChangePage}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

UserHead.propTypes = {
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  userId: PropTypes.number.isRequired,
  owner: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  trustedByUsersCount: PropTypes.number,
  trustedByUsersIds: PropTypes.arrayOf(PropTypes.number),
  trustedByMetadata: followersPropTypes.metadata,
  trustedByOnChangePage: PropTypes.func,
};

UserHead.defaultProps = {
  trustedByUsersCount: 0,
  trustedByUsersIds: [],
  trustedByMetadata: null,
  trustedByOnChangePage: null,
};

export default connect(state => ({
  users: state.users,
  owner: state.user.data,
}))(UserHead);
