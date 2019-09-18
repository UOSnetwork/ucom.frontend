import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import React from 'react';
import Wallet from './index';
import { selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';
import UserPick from '../../components/UserPick';
import * as Icons from './Icons';

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
            icon: <UserPick size={40} />,
            title: '@vera11clover',
            amount: '– 150  UOS',
          }, {
            icon: <UserPick size={40} />,
            title: '@bigyellowguy',
            amount: '3 010 UOS',
            message: 'That was awfull coffe man, but I gotta say…',
          }],
        }, {
          title: '11 November',
          list: [{
            icon: <UserPick size={40} />,
            title: `@${owner.accountName}`,
            amount: '1 154 UOS',
          }, {
            icon: <Icons.Net />,
            title: 'Staked for Network BW',
            amount: '– 154 UOS',
          }, {
            icon: <Icons.Ram />,
            title: 'Bought RAM',
            amount: '– 154 UOS',
          }, {
            icon: <Icons.Ram />,
            title: 'Sold RAM',
            amount: '154 UOS',
          }, {
            icon: <Icons.Cpu />,
            title: 'Staked for CPU Time',
            amount: '– 4 821.782 UOS',
          }, {
            icon: <Icons.Emission />,
            title: 'Recieved emission',
            amount: '12 330.39 UOS',
          }],
        }, {
          title: '12 November',
          list: [{
            icon: <UserPick src={urls.getFileUrl(owner.avatarFilename)} size={40} />,
            title: `@${owner.accountName}`,
            amount: '1 154 UOS',
            message: 'We’ve had a great time! That’s for coffe 🙂',
          }, {
            icon: <UserPick size={40} />,
            title: '@vera11clover',
            amount: '– 150  UOS',
          }, {
            icon: <UserPick size={40} />,
            title: '@bigyellowguy',
            amount: '3 010 UOS',
            message: 'That was awfull coffe man, but I gotta say…',
          }],
        }, {
          title: '11 November',
          list: [{
            icon: <UserPick size={40} />,
            title: `@${owner.accountName}`,
            amount: '1 154 UOS',
          }, {
            icon: <Icons.Net />,
            title: 'Staked for Network BW',
            amount: '– 154 UOS',
          }, {
            icon: <Icons.Ram />,
            title: 'Bought RAM',
            amount: '– 154 UOS',
          }, {
            icon: <Icons.Ram />,
            title: 'Sold RAM',
            amount: '154 UOS',
          }, {
            icon: <Icons.Cpu />,
            title: 'Staked for CPU Time',
            amount: '– 4 821.782 UOS',
          }, {
            icon: <Icons.Emission />,
            title: 'Recieved emission',
            amount: '12 330.39 UOS',
          }],
        }],
      }}
    />
  );
};
