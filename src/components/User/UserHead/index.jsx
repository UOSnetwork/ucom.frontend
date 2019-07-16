import { pick } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../EntryHeader/styles.css';
import Avatar from '../../EntryHeader/Avatar';
import urls from '../../../utils/urls';
import { updateUser, addUsers } from '../../../actions/users';
import { getUserName, userIsOwner } from '../../../utils/user';
import withLoader from '../../../utils/withLoader';
import { getFilePreview } from '../../../utils/upload';
import UserStatus from '../UserStatus';
import { formatScaledImportance } from '../../../utils/rate';
import UserFollowButton from '../UserFollowButton';
import { FollowersWrapper } from '../../Followers';
import ButtonEdit from '../../ButtonEdit';
import Menu from '../../EntryHeader/Menu';
import { selectUserById, selectOwner } from '../../../store/selectors';
import { USER_EDITABLE_PROPS } from '../../../utils/constants';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';

const UserHead = (props) => {
  const user = useSelector(selectUserById(props.userId));
  const owner = useSelector(selectOwner);
  const dispatch = useDispatch();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.entryHead}>
      {userIsOwner(user, owner) &&
        <div className={styles.edit}>
          <ButtonEdit strech url={urls.getUserEditProfileUrl(user.id)} />
        </div>
      }

      <Menu />

      <div className={styles.main}>
        <div className={styles.avatar}>
          <Avatar
            src={urls.getFileUrl(user.avatarFilename)}
            changeEnabled={userIsOwner(user, owner)}
            onChange={async (file) => {
              const oldAvatarFilename = user.avatarFilename;

              try {
                dispatch(addUsers([{
                  id: owner.id,
                  avatarFilename: getFilePreview(file),
                }]));
                withLoader(dispatch(updateUser({
                  ...pick(user, USER_EDITABLE_PROPS),
                  avatarFilename: file,
                })));
              } catch (err) {
                dispatch(addUsers([{
                  id: owner.id,
                  avatarFilename: oldAvatarFilename,
                }]));
                dispatch(addErrorNotificationFromResponse(err));
              }
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
        {!userIsOwner(user, owner) &&
          <div className={styles.followButton}>
            <UserFollowButton userId={user.id} />
          </div>
        }

        <div className={styles.usersLists}>
          <div>
            <FollowersWrapper
              title="Followers"
              count={props.followedByCount}
              usersIds={props.followedByUserIds}
              popupUsersIds={props.followedByPopupUserIds}
              metadata={props.followedByPopupMetadata}
              onChangePage={props.followedByOnChangePage}
            />
          </div>

          <div>
            <FollowersWrapper
              title="Following"
              count={props.iFollowCount}
              usersIds={props.iFollowUserIds}
              popupUsersIds={props.iFollowPopupUserIds}
              metadata={props.iFollowPopupMetadata}
              onChangePage={props.iFollowOnChangePage}
            />
          </div>

          <div>
            <FollowersWrapper
              title="Trusted by"
              count={props.trustedByCount}
              usersIds={props.trustedByUsersIds}
              metadata={props.trustedByPopupMetadata}
              popupUsersIds={props.trustedByPopupUsersIds}
              onChangePage={props.trustedByOnChangePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

UserHead.propTypes = {
  userId: PropTypes.number.isRequired,
  trustedByCount: PropTypes.number,
  trustedByUsersIds: PropTypes.arrayOf(PropTypes.number),
  trustedByPopupUsersIds: PropTypes.arrayOf(PropTypes.number),
  trustedByPopupMetadata: PropTypes.objectOf(PropTypes.any),
  trustedByOnChangePage: PropTypes.func.isRequired,
  iFollowCount: PropTypes.number,
  iFollowUserIds: PropTypes.arrayOf(PropTypes.number),
  iFollowPopupUserIds: PropTypes.arrayOf(PropTypes.number),
  iFollowPopupMetadata: PropTypes.objectOf(PropTypes.any),
  iFollowOnChangePage: PropTypes.func.isRequired,
  followedByCount: PropTypes.number,
  followedByUserIds: PropTypes.arrayOf(PropTypes.number),
  followedByPopupUserIds: PropTypes.arrayOf(PropTypes.number),
  followedByPopupMetadata: PropTypes.objectOf(PropTypes.any),
  followedByOnChangePage: PropTypes.func.isRequired,
};

UserHead.defaultProps = {
  trustedByCount: 0,
  trustedByUsersIds: [],
  trustedByPopupUsersIds: [],
  trustedByPopupMetadata: {},
  iFollowCount: 0,
  iFollowUserIds: [],
  iFollowPopupUserIds: [],
  iFollowPopupMetadata: {},
  followedByCount: 0,
  followedByUserIds: [],
  followedByPopupUserIds: [],
  followedByPopupMetadata: {},
};

export default UserHead;
