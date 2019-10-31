import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { memo, useState, Fragment } from 'react';
import styles from '../../styles.css';
import Popup from '../../../Popup';
import IconClose from '../../../Icons/Close';
import Button from '../../../Button/index';
import SaveKey from '../../Screens/SaveKey';

const SaveSocialKey = (props) => {
  const { t } = useTranslation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  return (
    <Fragment>
      {popupVisible &&
        <Popup onClickClose={() => setPopupVisible(false)}>
          <div className={styles.copyPopup}>
            <span className={styles.close}>
              <span
                role="presentation"
                className={styles.icon}
                onClick={() => setPopupVisible(false)}
              >
                <IconClose />
              </span>
            </span>
            <h3 className={styles.title}>{t('auth.copyYourKey')}</h3>
            <p className={styles.text}>{t('auth.warning')}</p>
            <div className={styles.action}>
              <Button big cap red strech onClick={props.onClickBack}>
                {t('GOTIT')}
              </Button>
            </div>
          </div>
        </Popup>
      }
      <SaveKey
        title={t('auth.saveSocialKey')}
        copyText={props.socialKey}
        proceedText={t('auth.proceedAuthorization')}
        onCopy={() => {
          setHasCopiedKey(true);
        }}
        onClickProceed={() => {
          if (!hasCopiedKey) {
            setPopupVisible(true);
            return;
          }
          props.onClickBack();
        }}
      />
    </Fragment>
  );
};

SaveSocialKey.propTypes = {
  onClickBack: PropTypes.func.isRequired,
  socialKey: PropTypes.string.isRequired,
};

export default memo(SaveSocialKey);
