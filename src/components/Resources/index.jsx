import { round } from 'lodash';
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
          value={`${formatNumber(round(ram.free, 2))} ${ram.dimension} Free`}
          total={`${formatNumber(round(ram.total, 2))} ${ram.dimension}`}
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
          value={`${formatNumber(round(cpu.free, 2))} ${cpu.dimension}`}
          total={`${formatNumber(round(cpu.total, 2))} ${cpu.dimension}`}
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
          value={`${formatNumber(round(net.free, 2))} ${net.dimension}`}
          total={`${formatNumber(round(net.total, 2))} ${net.dimension}`}
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
