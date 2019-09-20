import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Resource from './Resource';
import styles from './styles.css';
import {
  walletToggleBuyRam,
  walletToggleSellRam,
  walletToggleEditStake,
} from '../../actions/wallet';
import formatNumber from '../../utils/formatNumber';

const fixValue = amount => Math.round(amount * 100) / 100;
const getPercent = (free, total) => (free * 100) / total;

const Resources = (props) => {
  if (!props.wallet.resources) {
    return null;
  }

  const { ram, cpu, net } = props.wallet.resources;

  return (
    <div className={styles.resources}>
      {ram &&
        <Resource
          value={`${formatNumber(fixValue(ram.free))} ${ram.dimension} Free`}
          total={`${formatNumber(fixValue(ram.total))} ${ram.dimension}`}
          title="RAM"
          progress={getPercent(ram.free, ram.total)}
          actions={[{
            title: 'Buy',
            onClick: () => props.dispatch(walletToggleBuyRam(true)),
          }, {
            title: 'Sell',
            onClick: () => props.dispatch(walletToggleSellRam(true)),
          }]}
        />
      }
      {cpu &&
        <Resource
          value={`${formatNumber(fixValue(cpu.free))} ${cpu.dimension}`}
          total={`${formatNumber(fixValue(cpu.total))} ${cpu.dimension}`}
          title="CPU Time"
          progress={getPercent(cpu.free, cpu.total)}
          actions={[{
            title: 'Edit Stake',
            onClick: () => props.dispatch(walletToggleEditStake(true)),
          }]}
        />
      }
      {net &&
        <Resource
          value={`${formatNumber(fixValue(net.free))} ${net.dimension}`}
          total={`${formatNumber(fixValue(net.total))} ${net.dimension}`}
          title="Network BW"
          progress={getPercent(net.free, net.total)}
          actions={[{
            title: 'Edit Stake',
            onClick: () => props.dispatch(walletToggleEditStake(true)),
          }]}
        />
      }
    </div>
  );
};

const resourcPropTypes = PropTypes.shape({
  ram: PropTypes.number,
  total: PropTypes.number,
});

Resources.propTypes = {
  wallet: PropTypes.shape({
    resources: PropTypes.shape({
      ram: resourcPropTypes.isRequired,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(state => ({
  wallet: state.wallet,
}))(Resources);
