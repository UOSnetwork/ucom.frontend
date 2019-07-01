import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import Button from '../Button';
import { selectUser } from '../../store/selectors/user';
import { followUser, unfollowUser } from '../../actions/users';
import { getUserById } from '../../store/users';
import { authShowPopup } from '../../actions/auth';
import IconCheck from '../Icons/Check';
import loader from '../../utils/loader';
import { addServerErrorNotification } from '../../actions/notifications';
import { restoreActiveKey } from '../../utils/keys';

const UserFollowButton = (props) => {
  if (!props.userId) {
    return null;
  }

  const owner = getUserById(props.users, props.user.id);
  const user = getUserById(props.users, props.userId);

  if (!user) {
    return null;
  }

  const isFollow = user.myselfData && user.myselfData.follow;
  const userIsOwner = owner && Number(owner.id) === Number(user.id);
  const text = (isFollow || userIsOwner) ? 'Following' : 'Follow';

  const followOrUnfollow = async () => {
    const activeKey = restoreActiveKey();
    if (!props.user.id || !activeKey) {
      props.authShowPopup();
      return;
    }
    loader.start();
    try {
      await (isFollow ? props.unfollowUser : props.followUser)({ user, owner, activeKey });
    } catch (e) {
      props.addServerErrorNotification(e);
    }
    loader.done();
  };

  return props.asLink ? (
    <button
      className="link red-hover"
      onClick={followOrUnfollow}
    >
      {text}
      {(isFollow || userIsOwner) && <IconCheck />}
    </button>
  ) : (
    <Button
      isStretched
      isDisabled={userIsOwner}
      size="medium"
      theme="transparent"
      withCheckedIcon={isFollow || userIsOwner}
      text={text}
      onClick={followOrUnfollow}
    />
  );
};

UserFollowButton.propTypes = {
  unfollowUser: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  authShowPopup: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  asLink: PropTypes.bool,
  addServerErrorNotification: PropTypes.func.isRequired,
};

UserFollowButton.defaultProps = {
  asLink: false,
};

export default connect(
  state => ({
    users: state.users,
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    followUser,
    unfollowUser,
    authShowPopup,
    addServerErrorNotification,
  }, dispatch),
)(UserFollowButton);
