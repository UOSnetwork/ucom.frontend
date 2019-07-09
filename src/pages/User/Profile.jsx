import PropTypes from 'prop-types';
import React from 'react';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/User';

const ProfilePopup = ({ match, history }) => {
  const close = () => {
    history.push(urls.getUserUrl(match.params.userId));
  };

  return (
    <Popup
      id="profile-popup"
      paddingBottom="70vh"
      onClickClose={close}
    >
      <Content onClickClose={close}>
        <Profile
          onSuccess={close}
        />
      </Content>
    </Popup>
  );
};

ProfilePopup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProfilePopup;
