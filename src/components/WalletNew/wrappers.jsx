import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Wallet, { TAB_WALLET_ID, TAB_RESOURCES_ID } from './index';
import { selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';
import UserPick from '../../components/UserPick';
import * as walletActions from '../../actions/wallet';
import * as Icons from './Icons';

export const UserWallet = () => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const wallet = useSelector(state => state.wallet);
  const [activeTabId, setActiveTabId] = useState(TAB_WALLET_ID);

  if (!wallet.visible) {
    return null;
  }

  return (
    <Wallet
      onClickClose={() => dispatch(walletActions.toggle(false))}
      accountCard={{
        userAccountName: owner.accountName,
        userAvatarSrc: urls.getFileUrl(owner.avatarFilename),
        userUrl: urls.getUserUrl(owner.id),
      }}
      activeTabId={activeTabId}
      tabs={{
        noBorder: true,
        theme: 'thinBlack',
        items: [{
          title: 'Wallet',
          onClick: () => {
            setActiveTabId(TAB_WALLET_ID);
          },
          active: activeTabId === TAB_WALLET_ID,
        }, {
          title: 'Resources',
          active: activeTabId === TAB_RESOURCES_ID,
          onClick: () => {
            setActiveTabId(TAB_RESOURCES_ID);
          },
        }],
      }}
      ramResource={{
        title: 'RAM',
        label: '36 kB',
        percentage: 70,
        actions: [{
          title: 'Sell',
          onClick: () => {},
        }, {
          title: 'Buy',
          onClick: () => {},
        }],
      }}
      cpuTimeResource={{
        title: 'CPU Time',
        label: '60.47 Sec',
        percentage: 90,
        actions: [{
          title: 'EDIT STAKE',
          onClick: () => {},
        }],
      }}
      networkBandwithResource={{
        title: 'Network Bandwith',
        label: '5.47 kB',
        percentage: 80,
        actions: [{
          title: 'EDIT STAKE',
          onClick: () => {},
        }],
      }}
      tokenCards={[{
        color: '#B3E1E1',
        icon: <UserPick src={urls.getFileUrl(owner.avatarFilename)} size={32} />,
        tokens: [{
          title: 'UOS 676 888 888.9999',
          label: 'TestNet',
        }, {
          title: 'UOSF 888 888.9999',
          label: '≈ $25 745.78',
        }],
      }, {
        color: '#F2B554',
        tokens: [{
          title: 'UOS 3 123.4',
          label: 'TestNet',
        }, {
          title: 'UOSF 0',
          label: '$ 0',
        }],
      }]}
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
