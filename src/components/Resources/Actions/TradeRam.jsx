import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import styles from './styles.css';
import TextInput from '../../TextInput';
import Button from '../../Button/index';
import { walletBuyRam, walletSellRam, walletGetAccount } from '../../../actions/wallet';
import { parseResponseError } from '../../../utils/errors';
import IconInputError from '../../Icons/InputError';
import api from '../../../api';
import withLoader from '../../../utils/withLoader';
import { addSuccessNotification } from '../../../actions/notifications';
import Popup, { Content } from '../../Popup';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';

const TradeRam = (props) => {
  const [ram, setRam] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(null);

  const onSuccess = () => {
    setFormError(null);
    props.dispatch(addSuccessNotification(`Successfully ${props.sell ? 'sold' : 'bought'} RAM`));
    withLoader(props.dispatch(walletGetAccount(props.owner.accountName)));
    setTimeout(() => {
      props.onSubmit();
    }, 0);
  };

  const onError = (err) => {
    const errors = parseResponseError(err);
    setFormError(errors[0].message);
  };

  return (
    <RequestActiveKey
      replace
      onSubmit={async (privateKey) => {
        setLoading(true);
        try {
          const submitFn = props.sell ? walletSellRam : walletBuyRam;
          await withLoader(props.dispatch(submitFn(props.owner.accountName, ram, privateKey)));
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
      onScatterConnect={async (scatter) => {
        setLoading(true);
        try {
          if (props.sell) {
            await withLoader(scatter.sellRam(props.owner.accountName, ram));
          } else {
            await withLoader(scatter.buyRam(props.owner.accountName, ram));
          }
          onSuccess();
        } catch (err) {
          onError(err);
        }
        setLoading(false);
      }}
    >
      {(requestActiveKey, requestLoading) => (
        <Popup onClickClose={props.onClickClose}>
          <Content
            walletAction
            roundBorders={false}
            onClickClose={props.onClickClose}
          >
            <form
              className={styles.content}
              onSubmit={async (e) => {
                e.preventDefault();
                requestActiveKey();
              }}
            >
              <h2 className={styles.title}>{props.sell ? 'Sell' : 'Buy'} RAM</h2>
              <div className={styles.field}>
                <TextInput
                  autoFocus
                  placeholder="6664"
                  label="RAM Amount, Bytes"
                  value={`${ram}`}
                  onChange={async (value) => {
                    const intValue = parseInt(value, 10);
                    setRam(intValue || '');

                    if (!intValue) {
                      setCost(null);
                      return;
                    }

                    try {
                      const cost = await api.getApproximateRamPriceByBytesAmount(intValue);
                      setCost(cost);
                    } catch (e) {
                      console.error(e);
                      setCost(null);
                    }
                  }}
                />
              </div>
              {cost &&
                <div className={styles.cost}>
                  <div className={styles.value}>≈ {cost} UOS</div>
                  <div className={styles.label}>RAM Cost</div>
                </div>
              }
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
                  disabled={!ram || loading || requestLoading}
                >
                  {props.sell ? 'Sell' : 'Buy'}
                </Button>
              </div>
            </form>
          </Content>
        </Popup>
      )}
    </RequestActiveKey>
  );
};

TradeRam.propTypes = {
  owner: PropTypes.shape({
    accountName: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  sell: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onClickClose: PropTypes.func.isRequired,
};

TradeRam.defaultProps = {
  sell: false,
};

export default connect(state => ({
  owner: state.user.data,
}))(TradeRam);
