// TODO: Remove
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Popup, { Content } from '../../Popup';
import * as walletActions from '../../../actions/wallet';
import styles from './styles.css';
import TextInput from '../../TextInput';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';
import withLoader from '../../../utils/withLoader';
import api from '../../../api';
import SearchInput from '../../SearchInput';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';
import { selectOwner, selectUserById } from '../../../store/selectors';

const SendTokens = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const wallet = useSelector(state => state.wallet);
  const {
    editable, accountName, amount, memo, error, loading,
  } = wallet.sendTokens;
  const user = useSelector(selectUserById(accountName));
  const disabled = !amount || !accountName || loading;

  useEffect(() => () => {
    dispatch(walletActions.sendTokens.reset());
  }, []);

  if (!wallet.sendTokens.visible) {
    return null;
  }

  return (
    <RequestActiveKey
      replace
      onSubmit={activeKey => withLoader(dispatch(walletActions.sendTokens.submit(undefined, activeKey)))}
      onScatterConnect={scatter => withLoader(dispatch(walletActions.sendTokens.submit(scatter)))}
    >
      {(requestActiveKey, requestLoading) => (
        <Popup onClickClose={() => dispatch(walletActions.sendTokens.cancel())}>
          <Content walletAction onClickClose={() => dispatch(walletActions.sendTokens.cancel())}>
            <form
              className={styles.content}
              onSubmit={(e) => {
                e.preventDefault();
                requestActiveKey();
              }}
            >
              <h2 className={styles.title}>{t('Send Tokens')}</h2>
              <div className={styles.field}>
                <TextInput
                  autoFocus
                  placeholder="0"
                  label={t('UOS Amount')}
                  disabled={!editable}
                  value={`${amount}`}
                  onChange={(value) => {
                    const amount = parseInt(value, 10) || '';
                    dispatch(walletActions.sendTokens.merge({ amount }));
                  }}
                />
              </div>
              <label className={styles.field}>
                <div className={styles.label}>{t('Destination Account')}</div>
                <SearchInput
                  value={user}
                  isMulti={false}
                  isDisabled={!editable}
                  onChange={(user) => {
                    dispatch(walletActions.sendTokens.merge({ accountName: user.accountName }));
                  }}
                  loadOptions={async q =>
                    (await withLoader(api.searchUsersByAccountNameWithLimit(q, 20)))
                      .filter(i => i.id !== owner.id)
                  }
                />
              </label>
              <div className={styles.field}>
                <TextInput
                  disabled={!editable}
                  placeholder={t('Example')}
                  label={t('Memo')}
                  value={`${memo}`}
                  onChange={(memo) => {
                    dispatch(walletActions.sendTokens.merge({ memo }));
                  }}
                />
              </div>
              {error &&
                <div className={styles.error}>
                  <IconInputError />
                  <span>{error}</span>
                </div>
              }
              <div className={styles.action}>
                <Button cap big red strech type="submit" disabled={disabled || requestLoading}>{t('Send')}</Button>
              </div>
            </form>
          </Content>
        </Popup>
      )}
    </RequestActiveKey>
  );
};

export default SendTokens;
