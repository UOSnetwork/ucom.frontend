import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Token from './Token';
import {
  walletToggleSendTokens,
  walletToggleEditStake,
  walletGetEmission,
} from '../../../actions/walletSimple';
import loader from '../../../utils/loader';
import { addErrorNotification, addSuccessNotification } from '../../../actions/notifications';
import { parseResponseError } from '../../../utils/errors';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';
import formatNumber from '../../../utils/formatNumber';

const Tokens = (props) => {
  const { tokens } = props.wallet;

  if (!tokens) {
    return null;
  }

  return (
    <div className={styles.tokens}>
      <Token
        value={`${formatNumber(tokens.active)}`}
        label="Active, UOS"
        action={{
          title: 'Send',
          onClick: () => props.dispatch(walletToggleSendTokens(true)),
        }}
      />

      <Token
        value={`${formatNumber(tokens.staked)}`}
        label="Staked, UOS"
        action={{
          title: 'Edit Stake',
          onClick: () => props.dispatch(walletToggleEditStake(true)),
        }}
      />

      <RequestActiveKey
        onSubmit={async (privateKey) => {
          loader.start();
          try {
            await props.dispatch(walletGetEmission(props.owner.accountName, privateKey));
            props.dispatch(addSuccessNotification('Successfully get emission'));
          } catch (e) {
            const errors = parseResponseError(e);
            props.dispatch(addErrorNotification(errors[0].message));
          }
          loader.done();
        }}
      >
        {requestActiveKey => (
          <Token
            value={`${formatNumber(tokens.emission)}`}
            label="Emission, UOS"
            action={{
              disabled: +tokens.emission === 0,
              title: 'Get Emission',
              onClick: async () => {
                requestActiveKey();
              },
            }}
          />
        )}
      </RequestActiveKey>

      <Token
        value={`${formatNumber(tokens.uosFutures)}`}
        label="Active, UOS Futures"
      />

      {tokens.unstakingRequest && tokens.unstakingRequest.amount > 0 &&
        <div className={styles.unstaking}>
          You are unstaking <strong>{tokens.unstakingRequest.amount} {tokens.unstakingRequest.currency}</strong>
          {tokens.unstakingRequest.requestDatetime && `, ${moment(tokens.unstakingRequest.requestDatetime).fromNow()}`}
        </div>
      }
    </div>
  );
};

Tokens.propTypes = {
  wallet: PropTypes.shape({
    tokens: PropTypes.shape({
      active: PropTypes.number.isRequired,
      staked: PropTypes.number.isRequired,
      emission: PropTypes.number.isRequired,
      unstakingRequest: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        requestDatetime: PropTypes.string,
      }),
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  owner: PropTypes.shape({
    accountName: PropTypes.string,
  }).isRequired,
};

export default connect(state => ({
  wallet: state.walletSimple,
  owner: state.user.data,
}))(Tokens);
