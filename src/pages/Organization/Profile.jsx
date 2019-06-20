import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import Popup, { Content } from '../../components/Popup';
import { getOrganizationById } from '../../store/organizations';
import { getUserById } from '../../store/users';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/Organization';

const ProfilePopup = ({ history, organization, owner }) => {
  const onClickClose = () => {
    history.push(urls.getOrganizationUrl(organization.id));
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
          organization={organization}
          onSuccess={onClickClose}
        />
      </Content>
    </Popup>
  );
};

ProfilePopup.propTypes = {
  owner: PropTypes.objectOf(PropTypes.any).isRequired,
  organization: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect((state, props) => {
  const organization = getOrganizationById(state.organizations, props.match.params.organizationId);
  let owner;

  if (organization) {
    owner = getUserById(state.users, organization.userId);
  }
  return { organization, owner };
})(ProfilePopup);
