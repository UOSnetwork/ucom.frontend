import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Popup, { Content } from '../../Popup';
import { walletToggleEditStake, walletEditStake, walletGetAccount } from '../../../actions/wallet';
import styles from './styles.css';
import TextInput from '../../TextInput';
import IconInputError from '../../Icons/InputError';
import Button from '../../Button/index';
import withLoader from '../../../utils/withLoader';
import { parseResponseError } from '../../../utils/errors';
import api from '../../../api';
import { addSuccessNotification } from '../../../actions/notifications';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';

const EditStake = (props) => {
  const [cpu, setCpu] = useState('');
  const [net, setNet] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentNetAndCpuStakedTokens = async () => {
    setLoading(true);

    try {
      const data = await withLoader(api.getCurrentNetAndCpuStakedTokens(props.owner.accountName));
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
    props.dispatch(addSuccessNotification('Successfully set stake'));
    setTimeout(() => {
      withLoader(props.dispatch(walletGetAccount(props.owner.accountName)));
      props.dispatch(walletToggleEditStake(false));
    }, 0);
  };

  const onError = (err) => {
    const errors = parseResponseError(err);
    setFormError(errors[0].message);
  };

  useEffect(() => {
    if (props.wallet.editStakeVisible && props.owner.accountName) {
      getCurrentNetAndCpuStakedTokens();
    }
  }, [props.wallet.editStakeVisible, props.owner.accountName]);

  if (!props.wallet.editStakeVisible) {
    return null;
  }

  return (
    <RequestActiveKey
      replace
      onSubmit={async (privateKey) => {
        setLoading(true);
        try {
          await withLoader(props.dispatch(walletEditStake(props.owner.accountName, privateKey, net, cpu)));
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
      onScatterConnect={async (scatter) => {
        setLoading(true);
        try {
          await withLoader(scatter.stakeOrUnstakeTokens(props.owner.accountName, net, cpu));
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
    >
      {(requestActiveKey, requestLoading) => (
        <Popup onClickClose={() => props.dispatch(walletToggleEditStake(false))}>
          <Content walletAction onClickClose={() => props.dispatch(walletToggleEditStake(false))}>
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
                    label="UOS for CPU Time"
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
                    label="UOS for Network BW"
                    value={`${net}`}
                    onChange={async (value) => {
                      const intValue = parseInt(value, 10);
                      setNet(Number.isNaN(intValue) ? '' : intValue);
                    }}
                  />
                </div>
              </div>
              <div className={styles.hint}>
                Unstaking UOS from Bandwidth or CPU takes 3 days. After 3 days, you can claim your unstaked UOS.
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
                  Update
                </Button>
              </div>
            </form>
          </Content>
        </Popup>
      )}
    </RequestActiveKey>
  );
};

EditStake.propTypes = {
  owner: PropTypes.shape({
    accountName: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    editStakeVisible: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(state => ({
  owner: state.user.data,
  wallet: state.wallet,
}))(EditStake);
