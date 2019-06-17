import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import Popup, { Content } from '../../components/Popup';
import { getOrganizationById } from '../../store/organizations';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/Organization';

const ProfilePopup = ({ history, organization }) => (
  <Popup
    id="profile-popup"
    paddingBottom="70vh"
    onClickClose={() => history.push(urls.getOrganizationUrl(organization.id))}
  >
    <Content
      fixWidth
      onClickClose={() => history.push(urls.getOrganizationUrl(organization.id))}
    >
      <Profile
        organizationId={organization.id}
        onSuccess={() => history.push(urls.getOrganizationUrl(organization.id))}
      />
    </Content>
  </Popup>
);

ProfilePopup.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect((state, props) => ({
  organization: getOrganizationById(state.organizations, props.match.params.organizationId),
}))(ProfilePopup);
