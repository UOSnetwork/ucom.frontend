import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import TradeRam from './TradeRam';
import { walletToggleSellRam } from '../../../actions/wallet';

const BuyRam = props => props.wallet.sellRamVisible && (
  <TradeRam
    sell
    onClickClose={() => props.dispatch(walletToggleSellRam(false))}
    onSubmit={() => props.dispatch(walletToggleSellRam(false))}
  />
);

BuyRam.propTypes = {
  dispatch: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    sellRamVisible: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(state => ({
  wallet: state.wallet,
}))(BuyRam);
