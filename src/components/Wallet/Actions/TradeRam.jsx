import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import styles from './styles.css';
import TextInput from '../../TextInput';
import Button from '../../Button/index';
import * as walletActions from '../../../actions/wallet/index';
import { parseResponseError } from '../../../utils/errors';
import IconInputError from '../../Icons/InputError';
import api from '../../../api';
import withLoader from '../../../utils/withLoader';
import { addSuccessNotification } from '../../../actions/notifications';
import Popup, { Content } from '../../Popup';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';
import { selectOwner } from '../../../store';

const TradeRam = (props) => {
  const { t } = useTranslation();
  const owner = useSelector(selectOwner);
  const dispatch = useDispatch();
  const [ram, setRam] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(null);

  const onSuccess = () => {
    setFormError(null);
    dispatch(addSuccessNotification(t(`Successfully ${props.sell ? 'sold' : 'bought'} RAM`)));
    withLoader(dispatch(walletActions.getAccount(owner.accountName)));
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
          const submitFn = props.sell ? walletActions.sellRam : walletActions.buyRam;
          await withLoader(dispatch(submitFn(owner.accountName, ram, privateKey)));
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
            await withLoader(scatter.sellRam(owner.accountName, ram));
          } else {
            await withLoader(scatter.buyRam(owner.accountName, ram));
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
          <Content walletAction onClickClose={props.onClickClose}>
            <form
              className={styles.content}
              onSubmit={async (e) => {
                e.preventDefault();
                requestActiveKey();
              }}
            >
              <h2 className={styles.title}>{t(`${props.sell ? 'Sell' : 'Buy'} RAM`)}</h2>
              <div className={styles.field}>
                <TextInput
                  autoFocus
                  placeholder="6664"
                  label={t('RAMAmountBytes')}
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
                  <div className={styles.label}>{t('RAM Cost')}</div>
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
                  {props.sell ? t('Sell') : t('Buy')}
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
  sell: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onClickClose: PropTypes.func.isRequired,
};

TradeRam.defaultProps = {
  sell: false,
};

export default TradeRam;
