import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { isEqual, groupBy, round } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, memo, useCallback } from 'react';
import Wallet, { TAB_WALLET_ID, TAB_RESOURCES_ID } from '../../index';
import { selectOwner } from '../../../../store/selectors';
import urls from '../../../../utils/urls';
import UserPick from '../../../../components/UserPick';
import withLoader from '../../../../utils/withLoader';
import formatNumber from '../../../../utils/formatNumber';
import * as walletActions from '../../../../actions/wallet/index';
import * as Icons from '../../Icons';
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
} from '../../../../utils/constants';
import percent from '../../../../utils/percent';
import * as searchPopupActions from '../../../../actions/searchPopup';
import { addErrorNotificationFromResponse, addSuccessNotification } from '../../../../actions/notifications';
import { logout } from '../../../../utils/auth';

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

const UserWallet = ({ location }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const wallet = useSelector(state => state.wallet, isEqual);
  const { account, transactions } = wallet;
  const [activeTabId, setActiveTabId] = useState(TAB_WALLET_ID);
  const [accountInitialLoading, setAccountInitialLoading] = useState(false);
  const [transactionsInitialLoading, setTransactionsInitialLoading] = useState(false);
  const [transactionsMoreLoading, setTransactionsMoreLoading] = useState(false);
  const [emissionLoading, setEmissionLoading] = useState(false);
  const validTransactionsData = transactions.data.filter(i => transactionTypes.includes(i.trType));
  const transactionsGroups = groupBy(validTransactionsData, (trx) => {
    const date = new Date(trx.updatedAt);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });
  const transactionsGroupsKeys = Object.keys(transactionsGroups);
  const unstakingRequestTransactionsSection = account.tokens && account.tokens.unstakingRequest && account.tokens.unstakingRequest.requestDatetime ? ({
    list: [{
      icon: <Icons.St />,
      title: `${t('Unstaking')} ${account.tokens.unstakingRequest.requestDatetime ? `(${moment(account.tokens.unstakingRequest.requestDatetime).fromNow()})` : ''}`,
      amount: `${formatNumber(account.tokens.unstakingRequest.amount)} ${account.tokens.unstakingRequest.currency}`,
      disablePopup: true,
      deferred: true,
    }],
  }) : null;
  const tokenCards = [];
  const resources = {
    showPlaceholder: accountInitialLoading,
    sections: [],
  };
  let emissionCards = [{
    disabled: true,
    amount: '0 UOS',
    label: t('Your Emission'),
  }];

  if (account.tokens) {
    tokenCards.push({
      color: '#B3E1E1',
      icon: <UserPick src={urls.getFileUrl(owner.avatarFilename)} size={32} />,
      tokens: [{
        title: `UOS ${formatNumber(account.tokens.active || 0)}`,
        label: t('staked UOS', { count: formatNumber(account.tokens.staked || 0) }),
      }, {
        title: `UOSF ${formatNumber(account.tokens.uosFutures || 0)}`,
      }],
      actions: [{
        title: t('Send'),
        onClick: () => dispatch(walletActions.sendTokens.show()),
      }],
    });
  }

  if (account.resources && account.resources.ram) {
    resources.sections.push({
      title: t('Resources you own:'),
      actions: [{
        title: t('Sell'),
        onClick: () => dispatch(walletActions.toggleSellRam(true)),
      }, {
        title: t('Buy'),
        onClick: () => dispatch(walletActions.toggleBuyRam(true)),
      }],
      list: [{
        title: 'RAM',
        total: t('Available', { count: formatNumber(round(account.resources.ram.total, 2)), label: account.resources.ram.dimension }),
        used: `${formatNumber(round(account.resources.ram.used, 2))} ${account.resources.ram.dimension}`,
        percentage: percent(account.resources.ram.used, account.resources.ram.total),
      }],
    });
  }

  if (account.resources && (account.resources.cpu || account.resources.net)) {
    const list = [];

    if (account.resources.net) {
      list.push({
        title: t('Network bandwidth'),
        total: t('Available', { count: formatNumber(round(account.resources.net.total, 2)), label: account.resources.net.dimension }),
        used: `${formatNumber(round(account.resources.net.used, 2))} ${account.resources.net.dimension}`,
        percentage: percent(account.resources.net.used, account.resources.net.total),
      });
    }

    if (account.resources.cpu) {
      list.push({
        title: t('CPU Time'),
        total: t('Available', { count: formatNumber(round(account.resources.cpu.total, 2)), label: account.resources.cpu.dimension }),
        used: `${formatNumber(round(account.resources.cpu.used, 2))} ${account.resources.cpu.dimension}`,
        percentage: percent(account.resources.cpu.used, account.resources.cpu.total),
      });
    }

    resources.sections.push({
      title: <span>{t('Resources you staked', { resource: account.tokens ? `UOS ${formatNumber(account.tokens.staked)}` : '' })}</span>,
      actions: [{
        title: t('Set'),
        onClick: () => dispatch(walletActions.toggleEditStake(true)),
      }],
      list,
    });
  }

  if (account.tokens) {
    emissionCards = [{
      disabled: account.tokens.emission === 0,
      amount: `${formatNumber(account.tokens.emission)} UOS`,
      label: t('Your Emission'),
      onClick: async () => {
        if (emissionLoading && !account.tokens.emission) {
          return;
        }

        setEmissionLoading(true);
        try {
          await withLoader(dispatch(walletActions.claimEmission()));
          dispatch(addSuccessNotification(t('Successfully claim emission')));
        } catch (err) {
          dispatch(addErrorNotificationFromResponse(err));
        }
        setEmissionLoading(false);
      },
    }];
  }

  const getInitialAccountData = async () => {
    setAccountInitialLoading(true);
    try {
      await withLoader(dispatch(walletActions.getAccount(owner.accountName)));
      setAccountInitialLoading(false);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const getInitialTransactions = async () => {
    setTransactionsInitialLoading(true);
    try {
      await withLoader(dispatch(walletActions.getTransactions(1, TRANSACTIONS_PER_PAGE)));
      setTransactionsInitialLoading(false);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const getInitialData = () => {
    getInitialAccountData();
    getInitialTransactions();
  };

  const getNextTransactions = useCallback(async () => {
    const { metadata } = transactions;
    const page = metadata.page + 1;

    if (!metadata.hasMore || transactionsMoreLoading) {
      return;
    }

    setTransactionsMoreLoading(true);
    await withLoader(dispatch(walletActions.getTransactions(page, TRANSACTIONS_PER_PAGE, true)));
    setTransactionsMoreLoading(false);
  }, [wallet, walletActions, transactionsMoreLoading]);

  useEffect(() => {
    if (wallet.popup.visible) {
      getInitialData();
    } else {
      dispatch(walletActions.resetPopup());
    }
  }, [wallet.popup.visible]);

  if (!wallet.popup.visible) {
    return null;
  }

  return (
    <Wallet
      onClickClose={() => dispatch(walletActions.toggle(false))}
      onLoadMore={() => getNextTransactions()}
      menu={{
        items: [{
          title: t('Search'),
          onClick: () => {
            dispatch(walletActions.toggle(false));
            dispatch(searchPopupActions.show());
          },
        }, {
          to: urls.getUsersUrl(),
          isActive: () => location.pathname === urls.getUsersUrl(),
          title: t('People'),
        }, {
          to: urls.getOverviewCategoryUrl(),
          isActive: () => location.pathname.indexOf(urls.getOverviewCategoryUrl()) === 0,
          title: t('Overview'),
        }, {
          to: urls.getGovernanceUrl(),
          isActive: () => location.pathname.indexOf(urls.getGovernanceUrl()) === 0,
          title: t('Governance'),
        }, {
          title: t('Settings'),
          href: urls.getSettingsUrl(),
        }, {
          title: t('Log Out'),
          onClick: () => logout(),
        }],
      }}
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
          title: t('Wallet'),
          onClick: () => {
            setActiveTabId(TAB_WALLET_ID);
          },
          active: activeTabId === TAB_WALLET_ID,
        }, {
          title: t('Resources'),
          active: activeTabId === TAB_RESOURCES_ID,
          onClick: () => {
            setActiveTabId(TAB_RESOURCES_ID);
          },
        }],
      }}
      emissionCards={emissionCards}
      resources={resources}
      showTokenCardsPlaceholder={accountInitialLoading}
      tokenCards={tokenCards}
      sidebarBlocked={transactionsInitialLoading || (!transactionsInitialLoading && transactionsGroupsKeys.length === 0)}
      transactions={{
        showEmptyLabel: !transactionsInitialLoading && transactionsGroupsKeys.length === 0,
        showPlaceholder: transactionsInitialLoading,
        showLoader: transactions.metadata.hasMore,
        sections: (unstakingRequestTransactionsSection ? [unstakingRequestTransactionsSection] : [])
          .concat(transactionsGroupsKeys.map(time => ({
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
                    type: t('Transfer'),
                    avatarSrc: urls.getFileUrl(trx.user.avatarFilename) || '',
                    title: `@${trx.user.accountName}`,
                    amount: `${trx.trType === TRX_TYPE_TRANSFER_FROM ? '– ' : ''}${round(trx.tokens.active, 2)} ${trx.tokens.currency}`,
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

                  const titleAction = trx.trType === TRX_TYPE_STAKE_RESOURCES ? t('Staked') : t('Unstaking');

                  if (cpu && net) {
                    title = t('for Network BW and CPU Time', { action: titleAction });
                  } else if (cpu) {
                    title = t('for CPU Time', { action: titleAction });
                  } else {
                    title = t('for Network BW', { action: titleAction });
                  }

                  return ({
                    ...commonProps,
                    icon,
                    title,
                    amount: `${trx.trType === TRX_TYPE_STAKE_RESOURCES ? '– ' : ''}${cpu && net ? cpu + net : cpu || net} ${trx.resources.net.tokens.currency}`,
                    type: trx.trType === TRX_TYPE_STAKE_RESOURCES ? t('Stake') : t('Unstake'),
                  });
                }

                case TRX_TYPE_CLAIM_EMISSION:
                  return ({
                    ...commonProps,
                    type: t('Withdraw'),
                    icon: <Icons.Emission />,
                    title: t('Recieved emission'),
                    amount: `${round(trx.tokens.emission, 2)} ${trx.tokens.currency}`,
                  });

                case TRX_TYPE_BUY_RAM:
                case TRX_TYPE_SELL_RAM:
                  return ({
                    ...commonProps,
                    type: trx.trType === TRX_TYPE_BUY_RAM ? t('Buy RAM') : t('Sell RAM'),
                    icon: <Icons.Ram />,
                    title: t(`${trx.trType === TRX_TYPE_BUY_RAM ? 'Bought' : 'Sold'} RAM`),
                    amount: `${trx.trType === TRX_TYPE_BUY_RAM ? '– ' : ''}${round(trx.resources.ram.tokens.amount, 2)} ${trx.resources.ram.tokens.currency}`,
                  });

                case TRX_TYPE_VOTE_FOR_BP:
                case TRX_TYPE_VOTE_FOR_CALC: {
                  const nodes = trx.trType === TRX_TYPE_VOTE_FOR_BP ? trx.producers : trx.calculators;

                  return ({
                    ...commonProps,
                    type: t('Vote'),
                    icon: <Icons.Vote />,
                    title: nodes.length ? t('Voted for', { nodes: nodes.map(item => item).join(', ') }) : t('Not voted for anyone'),
                  });
                }

                default:
                  return ({
                    icon: <Icons.Default />,
                  });
              }
            }),
          }))),
      }}
    />
  );
};

export default withRouter(memo(UserWallet));
