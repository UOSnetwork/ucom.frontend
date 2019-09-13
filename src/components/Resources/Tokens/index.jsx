import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './styles.css';
import Token from './Token';
import {
  walletToggleSendTokens,
  walletToggleEditStake,
  walletGetEmission,
  walletGetAccount,
} from '../../../actions/walletSimple';
import { authShowPopup } from '../../../actions/auth';
import withLoader from '../../../utils/withLoader';
import { addErrorNotification, addSuccessNotification } from '../../../actions/notifications';
import { parseResponseError } from '../../../utils/errors';
import formatNumber from '../../../utils/formatNumber';
import { getSocialKey } from '../../../utils/keys';

const Tokens = (props) => {
  const { tokens } = props.wallet;
  const [loading, setLoading] = useState(false);

  const onSuccessGetEmission = async () => {
    props.dispatch(addSuccessNotification('Successfully get emission'));
    await withLoader(props.dispatch(walletGetAccount(props.owner.accountName)));
  };

  const onErrorGetEmission = (err) => {
    const errors = parseResponseError(err);
    props.dispatch(addErrorNotification(errors[0].message));
  };

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

      <Token
        value={`${formatNumber(tokens.emission)}`}
        label="Emission, UOS"
        action={{
          disabled: +tokens.emission === 0 || loading,
          title: 'Get Emission',
          onClick: async () => {
            const socialKey = getSocialKey();

            if (!socialKey || !props.owner.accountName) {
              props.dispatch(authShowPopup());
              return;
            }

            setLoading(true);

            try {
              await withLoader(props.dispatch(walletGetEmission(props.owner.accountName, socialKey)));
              onSuccessGetEmission();
            } catch (err) {
              onErrorGetEmission(err);
            }

            setLoading(true);
          },
        }}
      />

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
