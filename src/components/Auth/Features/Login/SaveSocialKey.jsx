import PropTypes from 'prop-types';
import React, { memo, useState, Fragment } from 'react';
import styles from '../../styles.css';
import Popup from '../../../Popup';
import IconClose from '../../../Icons/Close';
import Button from '../../../Button/index';
import SaveKey from '../../Screens/SaveKey';

const SaveSocialKey = (props) => {
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
            <h3 className={styles.title}>Copy Your Social Key and Save It</h3>
            <p className={styles.text}>This key is your way to authorize on a platform, it much safer and simplier than Brainkey. Keep it somewhere safe!</p>
            <div className={styles.action}>
              <Button
                big
                cap
                red
                strech
                onClick={props.onClickBack}
              >
                GOT IT
              </Button>
            </div>
          </div>
        </Popup>
      }
      <SaveKey
        title="Save Your Social Key"
        copyText={props.socialKey}
        proceedText="Proceed to Authorization"
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
