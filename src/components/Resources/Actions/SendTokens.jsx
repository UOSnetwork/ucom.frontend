import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import Popup, { Content } from '../../Popup';
import { walletToggleSendTokens, walletSendTokens } from '../../../actions/walletSimple';
import styles from './styles.css';
import TextInput from '../../TextInput';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';
import withLoader from '../../../utils/withLoader';
import { parseResponseError } from '../../../utils/errors';
import api from '../../../api';
import SearchInput from '../../SearchInput';
import { addSuccessNotification } from '../../../actions/notifications';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';

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
    <RequestActiveKey
      replace
      onSubmit={async (privateKey) => {
        setLoading(true);
        try {
          await withLoader(props.dispatch(walletSendTokens(props.owner.accountName, user.accountName, +amount, memo, privateKey)));
          setFormError(null);
          props.dispatch(addSuccessNotification('Successfully sent tokens'));
          setTimeout(() => {
            props.dispatch(walletToggleSendTokens(false));
          }, 0);
        } catch (e) {
          const errors = parseResponseError(e);
          setFormError(errors[0].message);
        }
        setLoading(false);
      }}
    >
      {requestActiveKey => (
        <Popup onClickClose={() => props.dispatch(walletToggleSendTokens(false))}>
          <Content
            walletAction
            roundBorders={false}
            onClickClose={() => props.dispatch(walletToggleSendTokens(false))}
          >
            <form
              className={styles.content}
              onSubmit={async (e) => {
                e.preventDefault();
                requestActiveKey();
              }}
            >
              <h2 className={styles.title}>Send Tokens</h2>
              <div className={styles.field}>
                <TextInput
                  autoFocus
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
                <SearchInput
                  isMulti={false}
                  loadOptions={async (q) => {
                    try {
                      const query = q[0] === '@' ? q.substr(1) : q;
                      const data = await withLoader(api.searchUsers(query));
                      return data.slice(0, 20).filter(i => i.id !== props.owner.id);
                    } catch (err) {
                      return [];
                    }
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
                  type="submit"
                  disabled={!amount || !user || !user.accountName || loading}
                >
                  Send
                </Button>
              </div>
            </form>
          </Content>
        </Popup>
      )}
    </RequestActiveKey>
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
