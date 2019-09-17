import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import React from 'react';
import Wallet from './index';
import { selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';

export const UserWallet = () => {
  const owner = useSelector(selectOwner, isEqual);

  return (
    <Wallet
      accountCard={{
        userAccountName: owner.accountName,
        userAvatarSrc: urls.getFileUrl(owner.avatarFilename),
        userUrl: urls.getUserUrl(owner.id),
      }}
      emissionCards={[{
        amount: '200.66 UOS',
        label: 'GitHub Airdrop',
      }, {
        amount: '1 913.66 UOS',
      }]}
    />
  );
};
