import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import Popup, { Content } from '../../Popup';
import { walletToggleSendTokens, walletSendTokens } from '../../../actions/walletSimple';
import styles from './styles.css';
import TextInput from '../../TextInput';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';
import loader from '../../../utils/loader';
import { parseWalletErros } from '../../../utils/errors';
import api from '../../../api';
import UserSearchInput from '../../UserSearchInput';
import { addSuccessNotification } from '../../../actions/notifications';

const SendTokens = (props) => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  if (!props.wallet.sendTokensVisibility) {
    return null;
  }

  return (
    <Popup onClickClose={() => props.dispatch(walletToggleSendTokens(false))}>
      <Content
        walletAction
        noRoundBorders
        onClickClose={() => props.dispatch(walletToggleSendTokens(false))}
      >
        <form
          className={styles.content}
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            loader.start();
            try {
              await props.dispatch(walletSendTokens(props.owner.accountName, user.accountName, +amount, memo));
              setFormError(null);
              props.dispatch(addSuccessNotification('Successfully sent tokens'));
              setTimeout(() => {
                props.dispatch(walletToggleSendTokens(false));
              }, 0);
            } catch (e) {
              const errors = parseWalletErros(e);
              setFormError(errors[0].message);
            }
            setLoading(false);
            loader.done();
          }}
        >
          <h2 className={styles.title}>Send Tokens</h2>
          <div className={styles.field}>
            <TextInput
              touched
              placeholder="0"
              label="UOS Amount"
              value={`${amount}`}
              onChange={(value) => {
                const intValue = parseInt(value, 10);
                setAmount(intValue || '');
              }}
            />
          </div>
          <label className={styles.field}>
            <div className={styles.label}>Destination Account</div>
            <UserSearchInput
              isMulti={false}
              loadOptions={async (q) => {
                loader.start();
                setLoading(true);
                let result = [];
                try {
                  const data = await api.searchUsers(q);
                  result = data.filter(i => i.id !== props.owner.id);
                } catch (e) {
                  result = [];
                }
                loader.done();
                setLoading(false);
                return result;
              }}
              value={user}
              onChange={user => setUser(user)}
            />
          </label>
          <div className={styles.field}>
            <TextInput
              touched
              placeholder="Example"
              label="Memo"
              value={`${memo}`}
              onChange={(value) => {
                setMemo(value);
              }}
            />
          </div>
          {formError &&
            <div className={styles.error}>
              <IconInputError />
              <span>{formError}</span>
            </div>
          }
          <div className={styles.action}>
            <Button
              cap
              big
              red
              strech
              disabled={!amount || !user || !user.accountName || loading}
            >
              Send
            </Button>
          </div>
        </form>
      </Content>
    </Popup>
  );
};

SendTokens.propTypes = {
  owner: PropTypes.shape({
    accountName: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    sendTokensVisibility: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(state => ({
  owner: state.user.data,
  wallet: state.walletSimple,
}))(SendTokens);
