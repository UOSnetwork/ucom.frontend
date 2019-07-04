import PropTypes from 'prop-types';
import React from 'react';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/User';

const ProfilePopup = ({ history, match }) => (
  <Popup
    id="profile-popup"
    paddingBottom="70vh"
    onClickClose={() => history.push(urls.getUserUrl(match.params.userId))}
  >
    <Content
      fixWidth
      onClickClose={() => history.push(urls.getUserUrl(match.params.userId))}
    >
      <Profile
        userId={match.params.userId}
        onSuccess={() => history.push(urls.getUserUrl(match.params.userId))}
      />
    </Content>
  </Popup>
);

ProfilePopup.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProfilePopup;
