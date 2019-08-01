import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import React, { memo } from 'react';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/Organization';
import { selectOrgById, selectUserById } from '../../store/selectors';

const ProfilePopup = ({ match, history }) => {
  const orgId = Number(match.params.organizationId);
  const org = useSelector(selectOrgById(orgId), isEqual);
  const owner = org ? useSelector(selectUserById(org.userId), isEqual) : undefined;

  const close = () => {
    history.push(urls.getOrganizationUrl(orgId));
  };

  if (!org || !org.myselfData || !org.myselfData.editable) {
    return null;
  }

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

export default memo(ProfilePopup);
