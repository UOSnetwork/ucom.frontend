import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import TradeRam from './TradeRam';
import * as walletActions from '../../../actions/wallet/index';

const BuyRam = () => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);

  if (!wallet.buyRam.visible) {
    return null;
  }

  return (
    <TradeRam
      onClickClose={() => dispatch(walletActions.toggleBuyRam(false))}
      onSubmit={() => dispatch(walletActions.toggleBuyRam(false))}
    />
  );
};

export default BuyRam;
