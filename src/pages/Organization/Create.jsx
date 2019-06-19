import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Profile from '../../components/Profile/Organization';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';

const CreatePopup = ({ history }) => {
  const onClickClose = () => {
    window.location.hash = '';
  };

  return (
    <Popup
      id="profile-popup"
      paddingBottom="70vh"
      onClickClose={onClickClose}
    >
      <Content
        fixWidth
        onClickClose={onClickClose}
      >
        <Profile
          onSuccess={(result) => {
            history.push(urls.getOrganizationUrl(result.id));
          }}
        />
      </Content>
    </Popup>
  );
};

CreatePopup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(CreatePopup);
