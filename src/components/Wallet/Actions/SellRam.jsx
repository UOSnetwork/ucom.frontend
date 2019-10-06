import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import TradeRam from './TradeRam';
import * as walletActions from '../../../actions/wallet/index';

const BuyRam = () => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);

  if (!wallet.sellRam.visible) {
    return null;
  }

  return (
    <TradeRam
      sell
      onClickClose={() => dispatch(walletActions.toggleSellRam(false))}
      onSubmit={() => dispatch(walletActions.toggleSellRam(false))}
    />
  );
};

export default BuyRam;
