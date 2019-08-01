import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import React, { memo } from 'react';
import Popup, { Content } from '../../components/Popup';
import urls from '../../utils/urls';
import Profile from '../../components/Profile/User';
import { selectOwner } from '../../store/selectors';

const ProfilePopup = ({ match, history }) => {
  const owner = useSelector(selectOwner, isEqual);

  const close = () => {
    history.push(urls.getUserUrl(match.params.userId));
  };

  if (!owner.id) {
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
          onSuccess={close}
        />
      </Content>
    </Popup>
  );
};

export default memo(ProfilePopup);
