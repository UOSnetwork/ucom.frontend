import { useTranslation } from 'react-i18next';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup, { Content } from '../Popup';
import * as subscribeActions from '../../actions/subscribe';
import { addSuccessNotification } from '../../actions/notifications';
import Form from './Form';
import styles from './styles.css';

const Subscribe = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector(state => state.subscribe);
  const hide = () => dispatch(subscribeActions.hide());

  if (!state.visible) {
    return null;
  }

  return (
    <Popup onClickClose={hide}>
      <Content
        fixWidth={false}
        onClickClose={hide}
      >
        <div className={styles.subscribe}>
          <h2 className={styles.title}>{t('Subscribe')}</h2>
          <p className={styles.description}>{t('subscribeUCommunity')}</p>

          <Form
            onSuccess={() => {
              dispatch(addSuccessNotification(t('Subscribe is successful')));
              hide();
            }}
          />
        </div>
      </Content>
    </Popup>
  );
};

export default Subscribe;
