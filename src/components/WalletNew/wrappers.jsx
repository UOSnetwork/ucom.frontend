import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import React from 'react';
import Wallet from './index';
import { selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';
import UserPick from '../../components/UserPick';

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
      transactions={{
        sections: [{
          title: '12 November',
          list: [{
            icon: <UserPick src={urls.getFileUrl(owner.avatarFilename)} size={40} />,
            title: `@${owner.accountName}`,
            amount: '1 154 UOS',
            message: 'We’ve had a great time! That’s for coffe 🙂',
          }, {
            title: '@vera11clover',
            amount: '– 150  UOS',
          }, {
            title: '@bigyellowguy',
            amount: '3 010 UOS',
            message: 'That was awfull coffe man, but I gotta say…',
          }],
        }, {
          title: '11 November',
          list: [{
            title: `@${owner.accountName}`,
            amount: '1 154 UOS',
          }],
        }],
      }}
    />
  );
};
