import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import Popup, { Content } from '../../Popup';
import { walletToggleSendTokens, walletSendTokens, walletGetAccount } from '../../../actions/wallet';
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
import { selectOwner } from '../../../store/selectors';

const SendTokens = () => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const wallet = useSelector(state => state.wallet);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const onSuccess = () => {
    setFormError(null);
    dispatch(addSuccessNotification('Successfully sent tokens'));
    setTimeout(() => {
      dispatch(walletGetAccount(owner.accountName));
      dispatch(walletToggleSendTokens(false));
    }, 0);
  };

  const onError = (err) => {
    const errors = parseResponseError(err);
    setFormError(errors[0].message);
  };

  if (!wallet.sendTokensVisibility) {
    return null;
  }

  return (
    <RequestActiveKey
      replace
      onSubmit={async (privateKey) => {
        setLoading(true);
        try {
          await withLoader(dispatch(walletSendTokens(owner.accountName, user.accountName, +amount, memo, privateKey)));
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
      onScatterConnect={async (scatter) => {
        setLoading(true);
        try {
          await scatter.sendTokens(owner.accountName, user.accountName, amount, memo);
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
    >
      {(requestActiveKey, requestLoading) => (
        <Popup onClickClose={() => dispatch(walletToggleSendTokens(false))}>
          <Content walletAction onClickClose={() => dispatch(walletToggleSendTokens(false))}>
            <form
              className={styles.content}
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                await requestActiveKey();
                setLoading(false);
              }}
            >
              <h2 className={styles.title}>Send Tokens</h2>
              <div className={styles.field}>
                <TextInput
                  autoFocus
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
                      return data.slice(0, 20).filter(i => i.id !== owner.id);
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
                  disabled={!amount || !user || !user.accountName || loading || requestLoading}
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

export default SendTokens;