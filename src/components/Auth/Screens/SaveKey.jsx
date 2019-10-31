import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from '../styles.css';
import IconArrowRight from '../../Icons/ArrowRight';
import Button from '../../Button/index';
import CopyPanel from '../../CopyPanel';

const SaveKey = props => (
  <div className={styles.content}>
    <div className={styles.main}>
      <div className={styles.form}>
        <h2 className={`${styles.title} ${styles.saveKey}`}>{props.title}</h2>
        <div className={styles.copy}>
          <CopyPanel
            value={props.copyText}
            onCopy={props.onCopy}
          />
        </div>
        <div className={styles.saveKeyText}>
          <span>
            {props.text || (
              <Trans i18nKey="auth.thisYourSocialPrivateKey">
                This is your Social Private Key.<br /><strong>You will need it to authorize on a platform</strong> from any device. Keep it safe.
              </Trans>
            )}
          </span>
        </div>
        {props.proceedAsLink ? (
          <div className={styles.proceedLink}>
            <span
              role="presentation"
              className={styles.navLink}
              onClick={props.onClickProceed}
            >
              <span className={styles.navText}>{props.proceedText}</span>
              <IconArrowRight />
            </span>
          </div>
        ) : (
          <div className={styles.action}>
            <Button
              red
              big
              cap
              strech
              onClick={props.onClickProceed}
            >
              {props.proceedText}
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);

SaveKey.propTypes = {
  title: PropTypes.string.isRequired,
  copyText: PropTypes.string.isRequired,
  text: PropTypes.node,
  proceedAsLink: PropTypes.bool,
  proceedText: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
  onClickProceed: PropTypes.func.isRequired,
};

SaveKey.defaultProps = {
  text: undefined,
  proceedAsLink: true,
  onCopy: undefined,
};

export default memo(SaveKey);
