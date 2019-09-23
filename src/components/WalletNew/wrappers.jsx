import moment from 'moment';
import { isEqual, groupBy, round } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, memo, useCallback } from 'react';
import Wallet, { TAB_WALLET_ID, TAB_RESOURCES_ID } from './index';
import { selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';
import UserPick from '../../components/UserPick';
import withLoader from '../../utils/withLoader';
import * as walletActions from '../../actions/wallet';
import * as Icons from './Icons';
import {
  TRX_TYPE_TRANSFER_FROM,
  TRX_TYPE_TRANSFER_TO,
  TRX_TYPE_STAKE_RESOURCES,
  TRX_TYPE_UNSTAKING_REQUEST,
  TRX_TYPE_VOTE_FOR_BP,
  TRX_TYPE_CLAIM_EMISSION,
  TRX_TYPE_BUY_RAM,
  TRX_TYPE_SELL_RAM,
  TRX_TYPE_VOTE_FOR_CALC,
} from '../../utils/constants';

const TRANSACTIONS_PER_PAGE = 50;

const transactionTypes = [
  TRX_TYPE_TRANSFER_FROM,
  TRX_TYPE_TRANSFER_TO,
  TRX_TYPE_STAKE_RESOURCES,
  TRX_TYPE_UNSTAKING_REQUEST,
  TRX_TYPE_VOTE_FOR_BP,
  TRX_TYPE_CLAIM_EMISSION,
  TRX_TYPE_BUY_RAM,
  TRX_TYPE_SELL_RAM,
  TRX_TYPE_VOTE_FOR_CALC,
];

export const UserWallet = memo(() => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const wallet = useSelector(state => state.wallet, isEqual);
  const [activeTabId, setActiveTabId] = useState(TAB_WALLET_ID);
  const [loading, setLoading] = useState(false);
  const validTransactionsData = wallet.transactions.data.filter(i => transactionTypes.includes(i.trType));
  const transactionsGroups = groupBy(validTransactionsData, (trx) => {
    const date = new Date(trx.updatedAt);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });

  const getInitialData = async () => {
    setLoading(true);
    await withLoader(dispatch(walletActions.getTransactions(1, TRANSACTIONS_PER_PAGE)));
    setLoading(false);
  };

  const getNextTransactions = useCallback(async () => {
    const { metadata } = wallet.transactions;

    if (!metadata.hasMore || loading) {
      return;
    }

    const page = metadata.page + 1;

    setLoading(true);
    await withLoader(dispatch(walletActions.getTransactions(page, TRANSACTIONS_PER_PAGE, true)));
    setLoading(false);
  }, [wallet, walletActions, loading]);

  useEffect(() => {
    if (wallet.visible) {
      getInitialData();
    } else {
      dispatch(walletActions.reset());
    }
  }, [wallet.visible]);

  if (!wallet.visible) {
    return null;
  }

  return (
    <Wallet
      onClickClose={() => dispatch(walletActions.toggle(false))}
      onLoadMore={() => getNextTransactions()}
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
        sections: Object.keys(transactionsGroups).map(time => ({
          title: moment(+time).format('D MMMM'),
          list: transactionsGroups[time].map((trx) => {
            switch (trx.trType) {
              case TRX_TYPE_TRANSFER_FROM:
              case TRX_TYPE_TRANSFER_TO:
                return ({
                  icon: <UserPick src={urls.getFileUrl(trx.user.avatarFilename)} size={40} />,
                  title: `@${trx.user.accountName}`,
                  amount: `${trx.trType === TRX_TYPE_TRANSFER_TO ? '– ' : ''}${round(trx.tokens.active, 2)} ${trx.tokens.currency}`,
                  message: trx.memo,
                });

              case TRX_TYPE_STAKE_RESOURCES:
              case TRX_TYPE_UNSTAKING_REQUEST: {
                let net;
                let cpu;
                let icon;
                let title;

                if (trx.trType === TRX_TYPE_STAKE_RESOURCES) {
                  net = round(trx.resources.net.tokens.selfDelegated, 2);
                  cpu = round(trx.resources.cpu.tokens.selfDelegated, 2);
                } else {
                  net = round(trx.resources.net.unstakingRequest.amount, 2);
                  cpu = round(trx.resources.cpu.unstakingRequest.amount, 2);
                }

                const amount = `${trx.trType === TRX_TYPE_STAKE_RESOURCES ? '– ' : ''}${cpu && net ? cpu + net : cpu || net} ${trx.resources.net.tokens.currency}`;

                if (net && cpu) {
                  icon = <Icons.St />;
                } else if (cpu) {
                  icon = <Icons.Cpu />;
                } else {
                  icon = <Icons.Net />;
                }

                const titleAction = trx.trType === TRX_TYPE_STAKE_RESOURCES ? 'Staked' : 'Unstaking';

                if (cpu && net) {
                  title = `${titleAction} for Network BW and CPU Time`;
                } else if (cpu) {
                  title = `${titleAction} for CPU Time`;
                } else {
                  title = `${titleAction} for Network BW`;
                }

                return ({
                  icon, title, amount,
                });
              }

              case TRX_TYPE_CLAIM_EMISSION:
                return ({
                  icon: <Icons.Emission />,
                  title: 'Recieved emission',
                  amount: `${round(trx.tokens.emission, 2)} ${trx.tokens.currency}`,
                });

              case TRX_TYPE_BUY_RAM:
              case TRX_TYPE_SELL_RAM:
                return ({
                  icon: <Icons.Ram />,
                  title: `${trx.trType === TRX_TYPE_BUY_RAM ? 'Bought' : 'Sold'} RAM`,
                  amount: `${trx.trType === TRX_TYPE_BUY_RAM ? '– ' : ''}${round(trx.resources.ram.tokens.amount, 2)} ${trx.resources.ram.tokens.currency}`,
                });

              case TRX_TYPE_VOTE_FOR_BP:
              case TRX_TYPE_VOTE_FOR_CALC: {
                const nodes = trx.trType === TRX_TYPE_VOTE_FOR_BP ? trx.producers : trx.calculators;

                return ({
                  icon: <Icons.Vote />,
                  title: nodes.length ? `Voted for ${nodes.map(item => item).join(', ')}` : 'Not voted for anyone',
                });
              }

              default:
                return ({
                  icon: <Icons.Default />,
                });
            }
          }),
        })),
      }}
    />
  );
});
