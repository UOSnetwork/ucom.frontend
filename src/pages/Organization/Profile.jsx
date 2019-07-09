import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React from 'react';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/Organization';
import { selectOrgById, selectUserById } from '../../store/selectors';

const ProfilePopup = ({ match, history }) => {
  const orgId = Number(match.params.organizationId);
  const org = useSelector(selectOrgById(orgId));
  const owner = org ? useSelector(selectUserById(org.userId)) : undefined;

  const close = () => {
    history.push(urls.getOrganizationUrl(orgId));
  };

  return (
    <Popup
      id="profile-popup"
      paddingBottom="70vh"
      onClickClose={close}
    >
      <Content onClickClose={close}>
        <Profile
          owner={owner}
          organization={org}
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
      organizationId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProfilePopup;
