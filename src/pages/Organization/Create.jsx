import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Profile from '../../components/Profile/Organization';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';
import { getUserById } from '../../store/users';

const CreatePopup = ({ history, owner }) => {
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
          owner={owner}
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
  owner: PropTypes.objectOf(PropTypes.any),
};

CreatePopup.defaultProps = {
  owner: undefined,
};

export default withRouter(connect(state => ({
  owner: getUserById(state.users, state.user.data.id),
}))(CreatePopup));
