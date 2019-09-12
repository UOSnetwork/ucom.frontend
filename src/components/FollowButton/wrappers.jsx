import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, memo } from 'react';
import FollowButton from './index';
import { selectOwner, selectUserById, selectOrgById } from '../../store/selectors';
import { getSocialKey } from '../../utils/keys';
import { authShowPopup } from '../../actions/auth';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import { followUser, unfollowUser, followOrg, unfollowOrg } from '../../actions/follow';
import withLoader from '../../utils/withLoader';
import equalByProps from '../../utils/equalByProps';

export const UserFollowButton = memo(({ userId, ...props }) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, equalByProps(['id', 'accountName']));
  const user = useSelector(selectUserById(userId), equalByProps(['id', 'accountName', 'myselfData.follow']));
  const followed = user && user.myselfData && user.myselfData.follow;
  const userIsOwner = owner && user && Number(owner.id) === Number(user.id);
  const text = followed || userIsOwner ? 'Following' : 'Follow';

  const followOrUnfollow = useCallback(async () => {
    const socialKey = getSocialKey();

    if (!owner.id || !socialKey) {
      dispatch(authShowPopup());
      return;
    }

    try {
      await withLoader(dispatch((followed ? unfollowUser : followUser)(owner.accountName, user.id, user.accountName, socialKey)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  }, [owner, user, followed]);

  if (!user) {
    return null;
  }

  return (
    <FollowButton
      {...props}
      text={text}
      followed={followed}
      onClick={followOrUnfollow}
    />
  );
});

UserFollowButton.propTypes = {
  userId: PropTypes.number.isRequired,
};

export const OrgFollowButton = memo(({ orgId, ...props }) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, equalByProps(['id', 'accountName']));
  const org = useSelector(selectOrgById(orgId), equalByProps(['id', 'blockchainId', 'myselfData.follow']));
  const followed = org && org.myselfData && org.myselfData.follow;
  const text = followed ? 'Joined' : 'Join';

  const followOrUnfollow = useCallback(async () => {
    const socialKey = getSocialKey();

    if (!owner.id || !socialKey) {
      dispatch(authShowPopup());
      return;
    }

    try {
      await withLoader(dispatch((followed ? unfollowOrg : followOrg)(owner.accountName, socialKey, org.blockchainId, org.id)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  }, [owner, org, followed]);

  if (!org) {
    return null;
  }

  return (
    <FollowButton
      {...props}
      text={text}
      followed={followed}
      onClick={followOrUnfollow}
    />
  );
});

OrgFollowButton.propTypes = {
  orgId: PropTypes.number.isRequired,
};
