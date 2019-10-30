import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Popup, { Content } from '../../Popup';
import * as walletActions from '../../../actions/wallet/index';
import styles from './styles.css';
import TextInput from '../../TextInput';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';
import withLoader from '../../../utils/withLoader';
import { parseResponseError } from '../../../utils/errors';
import api from '../../../api';
import { addSuccessNotification } from '../../../actions/notifications';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';
import { selectOwner } from '../../../store';

const EditStake = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const wallet = useSelector(state => state.wallet);
  const [cpu, setCpu] = useState('');
  const [net, setNet] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentNetAndCpuStakedTokens = async () => {
    setLoading(true);

    try {
      const data = await withLoader(api.getCurrentNetAndCpuStakedTokens(owner.accountName));
      setCpu(data.cpu);
      setNet(data.net);
    } catch (e) {
      const errors = parseResponseError(e);
      setFormError(errors[0].message);
    }

    setLoading(false);
  };

  const onSuccess = () => {
    setFormError(null);
    dispatch(addSuccessNotification(t('Successfully set stake')));
    setTimeout(() => {
      withLoader(dispatch(walletActions.getAccount(owner.accountName)));
      dispatch(walletActions.toggleEditStake(false));
    }, 0);
  };

  const onError = (err) => {
    const errors = parseResponseError(err);
    setFormError(errors[0].message);
  };

  useEffect(() => {
    if (wallet.editStake.visible && owner.accountName) {
      getCurrentNetAndCpuStakedTokens();
    }
  }, [wallet.editStake.visible, owner.accountName]);

  if (!wallet.editStake.visible) {
    return null;
  }

  return (
    <RequestActiveKey
      replace
      onSubmit={async (privateKey) => {
        setLoading(true);
        try {
          await withLoader(dispatch(walletActions.editStake(owner.accountName, privateKey, net, cpu)));
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
      onScatterConnect={async (scatter) => {
        setLoading(true);
        try {
          await withLoader(scatter.stakeOrUnstakeTokens(owner.accountName, net, cpu));
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
    >
      {(requestActiveKey, requestLoading) => (
        <Popup onClickClose={() => dispatch(walletActions.toggleEditStake(false))}>
          <Content walletAction onClickClose={() => dispatch(walletActions.toggleEditStake(false))}>
            <form
              className={styles.content}
              onSubmit={async (e) => {
                e.preventDefault();
                requestActiveKey();
              }}
            >
              <h2 className={styles.title}>Set Stake</h2>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <TextInput
                    autoFocus
                    placeholder="6664"
                    label={t('UOS for CPU Time')}
                    value={`${cpu}`}
                    onChange={async (value) => {
                      const intValue = parseInt(value, 10);
                      setCpu(Number.isNaN(intValue) ? '' : intValue);
                    }}
                  />
                </div>
                <div className={styles.field}>
                  <TextInput
                    placeholder="6664"
                    label={t('UOS for Network BW')}
                    value={`${net}`}
                    onChange={async (value) => {
                      const intValue = parseInt(value, 10);
                      setNet(Number.isNaN(intValue) ? '' : intValue);
                    }}
                  />
                </div>
              </div>
              <div className={styles.hint}>
                {t('UnstakingUOSBandwidth')}
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
                  disabled={!`${cpu}`.length || !`${net}`.length || loading || requestLoading}
                >
                  {t('Update')}
                </Button>
              </div>
            </form>
          </Content>
        </Popup>
      )}
    </RequestActiveKey>
  );
};

export default EditStake;
