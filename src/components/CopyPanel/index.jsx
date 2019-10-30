import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import utilsActions from '../../actions/utils';

const CopyPanel = ({ label, value, onCopy }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div
      className={classNames({
        [styles.copyPanel]: true,
        [styles.noLabel]: !label,
      })}
    >
      {label && <div className={styles.label}>{label}</div>}

      <div className={styles.value}>{value}</div>

      <div
        role="presentation"
        className="link red"
        onClick={() => {
          dispatch(utilsActions.copyToClipboard(value));

          if (onCopy) {
            onCopy();
          }
        }}
      >
        {t('Copy')}
      </div>
    </div>
  );
};

CopyPanel.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
};

CopyPanel.defaultProps = {
  label: undefined,
  onCopy: undefined,
};

export default CopyPanel;
