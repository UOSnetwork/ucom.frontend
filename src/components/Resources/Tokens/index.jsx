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
import { parseWalletErros } from '../../../utils/errors';

const Tokens = (props) => {
  const { tokens } = props.wallet;

  if (!tokens) {
    return null;
  }

  return (
    <div className={styles.tokens}>
      <Token
        value={`${tokens.active}`}
        label="Active, UOS"
        action={{
          title: 'Send',
          onClick: () => props.dispatch(walletToggleSendTokens(true)),
        }}
      />
      <Token
        value={`${tokens.staked}`}
        label="Staked, UOS"
        action={{
          title: 'Edit Stake',
          onClick: () => props.dispatch(walletToggleEditStake(true)),
        }}
      />
      <Token
        value={`${tokens.emission}`}
        label="Emission, UOS"
        action={{
          title: 'Get Emission',
          onClick: async () => {
            loader.start();
            try {
              await props.dispatch(walletGetEmission(props.owner.accountName));
              props.dispatch(addSuccessNotification('Successfully get emission'));
            } catch (e) {
              const errors = parseWalletErros(e);
              props.dispatch(addErrorNotification(errors[0].message));
            }
            loader.done();
          },
        }}
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
