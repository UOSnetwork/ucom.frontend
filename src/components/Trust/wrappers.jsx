import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Trust from './index';
import { selectUserById } from '../../store/selectors';
import { getUserName, equalByProps, withLoader } from '../../utils';
import urls from '../../utils/urls';
import { trustUserOrShowErrorNotification, untrustUserOrShowErrorNotification } from '../../actions/users';

export const UserTrust = ({ userId, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUserById(userId), equalByProps([]));

  const submitTrust = async (isTrust) => {
    if (loading) {
      return;
    }

    setLoading(true);
    const trustFn = isTrust ? trustUserOrShowErrorNotification : untrustUserOrShowErrorNotification;
    await withLoader(dispatch(trustFn(userId, user.accountName)));
    setLoading(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Trust
      loading={loading}
      trusted={user && user.myselfData && user.myselfData.trust}
      userName={getUserName(user)}
      userAvtarUrl={urls.getFileUrl(user.avatarFilename)}
      onClickTrust={() => submitTrust(true)}
      onClickUntrust={() => submitTrust(false)}
    />
  );
};

UserTrust.propTypes = {
  userId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
};

UserTrust.defaultProps = {
  onSuccess: undefined,
};
