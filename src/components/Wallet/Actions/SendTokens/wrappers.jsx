import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import SendTokens from './index';
import * as walletActions from '../../../../actions/wallet';
import withLoader from '../../../../utils/withLoader';

export const SendTokensWrapper = () => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet, isEqual);
  const {
    editable, accountName, amount, memo, error, loading,
  } = wallet.sendTokens;

  return (
    <SendTokens
      onSubmitByActiveKey={activeKey => withLoader(dispatch(walletActions.sendTokens.submit(undefined, activeKey)))}
      onSubmitByScatter={scatter => withLoader(dispatch(walletActions.sendTokens.submit(scatter)))}
      onClose={() => dispatch(walletActions.sendTokens.cancel())}
      editable={editable}
      amount={amount}
      onChangeAmount={amount => dispatch(walletActions.sendTokens.merge({ amount }))}
      accountName={accountName}
      onChangeAccountName={accountName => dispatch(walletActions.sendTokens.merge({ accountName }))}
      memo={memo}
      onChangeMemo={memo => dispatch(walletActions.sendTokens.merge({ memo }))}
      error={error}
      loading={loading}
    />
  );
};
