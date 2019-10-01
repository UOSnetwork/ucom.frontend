import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import TradeRam from './TradeRam';
import { walletToggleBuyRam } from '../../../actions/wallet';

const BuyRam = props => props.wallet.buyRamVisible && (
  <TradeRam
    onClickClose={() => props.dispatch(walletToggleBuyRam(false))}
    onSubmit={() => props.dispatch(walletToggleBuyRam(false))}
  />
);

BuyRam.propTypes = {
  dispatch: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    buyRamVisible: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(state => ({
  wallet: state.wallet,
}))(BuyRam);
