import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import React from 'react';
import Popup, { Content } from '../../../Popup';
import styles from '../styles.css';
import TextInput from '../../../TextInput';
import IconInputError from '../../../Icons/InputError';
import Button from '../../../Button/index';
import withLoader from '../../../../utils/withLoader';
import api from '../../../../api';
import SearchInput from '../../../SearchInput';
import RequestActiveKey from '../../../Auth/Features/RequestActiveKey';
import { selectOwner, selectUserById } from '../../../../store/selectors';

const SendTokens = ({
  onSubmitByActiveKey,
  onSubmitByScatter,
  onClose,
  editable,
  amount,
  onChangeAmount,
  accountName,
  onChangeAccountName,
  memo,
  onChangeMemo,
  error,
  loading,
}) => {
  const { t } = useTranslation();
  const user = useSelector(selectUserById(accountName), isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const disabled = !amount || !accountName || loading;

  return (
    <RequestActiveKey
      replace
      onSubmit={onSubmitByActiveKey}
      onScatterConnect={onSubmitByScatter}
    >
      {(requestActiveKey, requestLoading) => (
        <Popup onClickClose={onClose}>
          <Content walletAction onClickClose={onClose}>
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
                  onChange={value => onChangeAmount(parseInt(value, 10) || '')}
                />
              </div>
              <label className={styles.field}>
                <div className={styles.label}>{t('Destination Account')}</div>
                <SearchInput
                  value={user}
                  isMulti={false}
                  isDisabled={!editable}
                  onChange={user => onChangeAccountName(user.accountName)}
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
                  onChange={onChangeMemo}
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

SendTokens.propTypes = {
  onSubmitByActiveKey: PropTypes.func.isRequired,
  onSubmitByScatter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  amount: PropTypes.string,
  onChangeAmount: PropTypes.func.isRequired,
  accountName: PropTypes.string,
  onChangeAccountName: PropTypes.func.isRequired,
  memo: PropTypes.string,
  onChangeMemo: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

SendTokens.defaultProps = {
  editable: true,
  amount: '',
  accountName: '',
  memo: '',
  error: '',
  loading: false,
};

export * from './wrappers';
export default SendTokens;
