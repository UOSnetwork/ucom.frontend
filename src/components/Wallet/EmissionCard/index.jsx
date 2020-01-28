import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import * as Icons from '../../Icons/WalletIcons';
import RequestActiveKey from '../../Auth/Features/RequestActiveKey';

const EmissionCard = ({
  icon, amount, label, onClick, disabled, requestActiveKeyEnabled,
}) => {
  const { t } = useTranslation();

  return (
    <RequestActiveKey
      onSubmit={(activeKey) => {
        onClick(activeKey);
      }}
    >
      {(requestActiveKey, requestLoading) => (
        <div
          role="presentation"
          className={classNames({
            [styles.emissionCard]: true,
            [styles.disabled]: disabled || requestLoading,
          })}
          onClick={() => {
            if (disabled) {
              return;
            }

            if (requestActiveKeyEnabled && onClick) {
              requestActiveKey();
              return;
            }

            if (onClick) {
              onClick();
            }
          }}
        >
          <div className={styles.icon}>{icon}</div>
          <div>
            <div className={styles.amount}>{amount}</div>
            <div className={styles.label}>{label || t('Your Emission')}</div>
          </div>
          {!disabled &&
            <div className={styles.action}>{t('Get')}</div>
          }
        </div>
      )}
    </RequestActiveKey>
  );
};

EmissionCard.propTypes = {
  icon: PropTypes.node,
  amount: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  requestActiveKeyEnabled: PropTypes.bool,
};

EmissionCard.defaultProps = {
  icon: <Icons.Emission />,
  amount: '…',
  label: undefined,
  onClick: undefined,
  disabled: false,
  requestActiveKeyEnabled: false,
};

export default EmissionCard;
