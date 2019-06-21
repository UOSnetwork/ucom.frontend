import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import styles from './styles.css';
import TextInput from '../../TextInput';
import Button from '../../Button/index';
import { walletBuyRam, walletSellRam } from '../../../actions/walletSimple';
import { parseResponseError } from '../../../utils/errors';
import IconInputError from '../../Icons/InputError';
import api from '../../../api';
import loader from '../../../utils/loader';
import { addSuccessNotification } from '../../../actions/notifications';
import Popup, { Content } from '../../Popup';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';

const TradeRam = (props) => {
  const [ram, setRam] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(null);

  return (
    <RequestActiveKey
      replace
      onSubmit={async (privateKey) => {
        setLoading(true);
        loader.start();
        try {
          const submitFn = props.sell ? walletSellRam : walletBuyRam;
          await props.dispatch(submitFn(props.owner.accountName, ram, privateKey));
          setFormError(null);
          props.dispatch(addSuccessNotification(`Successfully ${props.sell ? 'sold' : 'bought'} RAM`));
          setTimeout(() => {
            props.onSubmit();
          }, 0);
        } catch (e) {
          const errors = parseResponseError(e);
          setFormError(errors[0].message);
        }
        setLoading(false);
        loader.done();
      }}
    >
      {requestActiveKey => (
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
                  touched
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
                  disabled={!ram || loading}
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
