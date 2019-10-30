import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import * as Icons from '../../Icons/WalletIcons';

const EmissionCard = ({
  icon, amount, label, onClick, disabled,
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="presentation"
      className={classNames({
        [styles.emissionCard]: true,
        [styles.disabled]: disabled,
      })}
      onClick={onClick}
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
  );
};

EmissionCard.propTypes = {
  icon: PropTypes.node,
  amount: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

EmissionCard.defaultProps = {
  icon: <Icons.Emission />,
  amount: '…',
  label: undefined,
  onClick: undefined,
  disabled: false,
};

export default EmissionCard;
