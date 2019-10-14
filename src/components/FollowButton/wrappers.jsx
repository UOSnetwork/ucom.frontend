import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, memo, useState } from 'react';
import FollowButton from './index';
import { selectOwner, selectUserById, selectOrgById } from '../../store/selectors';
import { getSocialKey } from '../../utils/keys';
import { authShowPopup } from '../../actions/auth';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import { followOrUnfollowUser, followOrg, unfollowOrg } from '../../actions/follow';
import withLoader from '../../utils/withLoader';
import equalByProps from '../../utils/equalByProps';

export const UserFollowButton = memo(({ userId, ...props }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const owner = useSelector(selectOwner, equalByProps(['id', 'accountName']));
  const user = useSelector(selectUserById(userId), equalByProps(['id', 'accountName', 'myselfData.follow']));
  const followed = user && user.myselfData && user.myselfData.follow;
  const userIsOwner = owner && user && Number(owner.id) === Number(user.id);
  const text = followed || userIsOwner ? 'Following' : 'Follow';

  const followOrUnfollow = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch(followOrUnfollowUser(user.id, !followed)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    setLoading(false);
  }, [user, followed, loading]);

  if (!user) {
    return null;
  }

  return (
    <FollowButton
      {...props}
      text={text}
      followed={followed}
      onClick={followOrUnfollow}
      disabled={loading}
    />
  );
});

UserFollowButton.propTypes = {
  userId: PropTypes.number.isRequired,
};

export const OrgFollowButton = memo(({ orgId, ...props }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const owner = useSelector(selectOwner, equalByProps(['id', 'accountName']));
  const org = useSelector(selectOrgById(orgId), equalByProps(['id', 'blockchainId', 'myselfData.follow']));
  const followed = org && org.myselfData && org.myselfData.follow;
  const text = followed ? 'Joined' : 'Join';

  const followOrUnfollow = useCallback(async () => {
    if (loading) {
      return;
    }

    const socialKey = getSocialKey();

    if (!owner.id || !socialKey) {
      dispatch(authShowPopup());
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch((followed ? unfollowOrg : followOrg)(owner.accountName, socialKey, org.blockchainId, org.id)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    setLoading(false);
  }, [owner, org, followed, loading]);

  if (!org) {
    return null;
  }

  return (
    <FollowButton
      {...props}
      text={text}
      followed={followed}
      onClick={followOrUnfollow}
      disabled={loading}
    />
  );
});

OrgFollowButton.propTypes = {
  orgId: PropTypes.number.isRequired,
};
