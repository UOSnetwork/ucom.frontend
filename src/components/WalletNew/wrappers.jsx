import moment from 'moment';
import { isEqual, groupBy, round } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, memo, useCallback } from 'react';
import Wallet, { TAB_WALLET_ID, TAB_RESOURCES_ID } from './index';
import { selectOwner } from '../../store/selectors';
import urls from '../../utils/urls';
import UserPick from '../../components/UserPick';
import withLoader from '../../utils/withLoader';
import formatNumber from '../../utils/formatNumber';
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
import percent from '../../utils/percent';
import { getSocialKey } from '../../utils/keys';
import { authShowPopup } from '../../actions/auth';
import { addErrorNotification, addSuccessNotification } from '../../actions/notifications';
import { parseResponseError } from '../../utils/errors';

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
  const [emissionLoading, setEmissionLoading] = useState(false);
  const validTransactionsData = wallet.transactions.data.filter(i => transactionTypes.includes(i.trType));
  const transactionsGroups = groupBy(validTransactionsData, (trx) => {
    const date = new Date(trx.updatedAt);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });
  const tokenCards = [];
  let ramResource = null;
  let cpuTimeResource = null;
  let networkBandwithResource = null;
  const emissionCards = [];

  if (wallet.tokens && wallet.tokens.active) {
    tokenCards.push({
      color: '#B3E1E1',
      icon: <UserPick src={urls.getFileUrl(owner.avatarFilename)} size={32} />,
      tokens: [{
        title: `UOS ${formatNumber(wallet.tokens.active)}`,
        label: 'TestNet',
      }, {
        title: `UOSF ${formatNumber(wallet.tokens.uosFutures)}`,
      }],
      actions: [{
        title: 'Send',
        onClick: () => dispatch(walletActions.walletToggleSendTokens(true)),
      }],
    });
  }

  if (wallet.resources && wallet.resources.ram) {
    ramResource = {
      title: 'RAM',
      label: `${formatNumber(round(wallet.resources.ram.total, 2))} ${wallet.resources.ram.dimension}`,
      percentage: percent(wallet.resources.ram.free, wallet.resources.ram.total),
      actions: [{
        title: 'Sell',
        onClick: () => dispatch(walletActions.walletToggleSellRam(true)),
      }, {
        title: 'Buy',
        onClick: () => dispatch(walletActions.walletToggleBuyRam(true)),
      }],
    };
  }

  if (wallet.resources && wallet.resources.cpu) {
    cpuTimeResource = {
      title: 'CPU Time',
      label: `${formatNumber(round(wallet.resources.cpu.total, 2))} ${wallet.resources.cpu.dimension}`,
      percentage: percent(wallet.resources.cpu.free, wallet.resources.cpu.total),
      actions: [{
        title: 'Edit Stake',
        onClick: () => dispatch(walletActions.walletToggleEditStake(true)),
      }],
    };
  }

  if (wallet.resources && wallet.resources.net) {
    networkBandwithResource = {
      title: 'Network Bandwith',
      label: `${formatNumber(round(wallet.resources.net.total, 2))} ${wallet.resources.net.dimension}`,
      percentage: percent(wallet.resources.net.free, wallet.resources.net.total),
      actions: [{
        title: 'Edit Stake',
        onClick: () => dispatch(walletActions.walletToggleEditStake(true)),
      }],
    };
  }

  if (wallet.tokens) {
    emissionCards.push({
      amount: `${formatNumber(wallet.tokens.emission)} UOS`,
      label: 'Your Emission',
      onClick: async () => {
        if (emissionLoading && !wallet.tokens.emission) {
          return;
        }

        const socialKey = getSocialKey();

        if (!socialKey || !owner.accountName) {
          dispatch(authShowPopup());
          return;
        }

        setEmissionLoading(true);

        try {
          await withLoader(dispatch(walletActions.walletGetEmission(owner.accountName, socialKey)));
          await withLoader(dispatch(walletActions.walletGetAccount(owner.accountName)));
          dispatch(addSuccessNotification('Successfully get emission'));
        } catch (err) {
          const errors = parseResponseError(err);
          dispatch(addErrorNotification(errors[0].message));
        }

        setEmissionLoading(false);
      },
    });
  }

  const getInitialData = async () => {
    setLoading(true);
    await withLoader(dispatch(walletActions.walletGetAccount(owner.accountName)));
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

  // TODO: Add memo for popup
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
      emissionCards={emissionCards}
      ramResource={ramResource}
      cpuTimeResource={cpuTimeResource}
      networkBandwithResource={networkBandwithResource}
      tokenCards={tokenCards}
      transactions={{
        showLoader: wallet.transactions.metadata.hasMore,
        sections: Object.keys(transactionsGroups).map(time => ({
          title: moment(+time).format('D MMMM'),
          list: transactionsGroups[time].map((trx) => {
            const commonProps = {
              date: moment(trx.updatedAt).format('DD MMMM YYYY HH:mm:ss'),
              details: JSON.stringify(trx.rawTrData, null, 4),
            };

            switch (trx.trType) {
              case TRX_TYPE_TRANSFER_FROM:
              case TRX_TYPE_TRANSFER_TO:
                return ({
                  ...commonProps,
                  type: 'Transfer',
                  // TODO: Fix for no avatar
                  avatarSrc: urls.getFileUrl(trx.user.avatarFilename),
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
                  ...commonProps,
                  icon,
                  title,
                  amount: `${trx.trType === TRX_TYPE_STAKE_RESOURCES ? '– ' : ''}${cpu && net ? cpu + net : cpu || net} ${trx.resources.net.tokens.currency}`,
                  type: trx.trType === TRX_TYPE_STAKE_RESOURCES ? 'Stake' : 'Unstake',
                });
              }

              case TRX_TYPE_CLAIM_EMISSION:
                return ({
                  ...commonProps,
                  type: 'Withdraw',
                  icon: <Icons.Emission />,
                  title: 'Recieved emission',
                  amount: `${round(trx.tokens.emission, 2)} ${trx.tokens.currency}`,
                });

              case TRX_TYPE_BUY_RAM:
              case TRX_TYPE_SELL_RAM:
                return ({
                  ...commonProps,
                  type: trx.trType === TRX_TYPE_BUY_RAM ? 'Buy RAM' : 'Sell RAM',
                  icon: <Icons.Ram />,
                  title: `${trx.trType === TRX_TYPE_BUY_RAM ? 'Bought' : 'Sold'} RAM`,
                  amount: `${trx.trType === TRX_TYPE_BUY_RAM ? '– ' : ''}${round(trx.resources.ram.tokens.amount, 2)} ${trx.resources.ram.tokens.currency}`,
                });

              case TRX_TYPE_VOTE_FOR_BP:
              case TRX_TYPE_VOTE_FOR_CALC: {
                const nodes = trx.trType === TRX_TYPE_VOTE_FOR_BP ? trx.producers : trx.calculators;

                return ({
                  ...commonProps,
                  type: 'Vote',
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
