import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import IconClose from '../Icons/Close';

const Close = ({
  showLabel, label, onClick, goBackOnClick, history, location, top, right, left, bottom,
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="presentation"
      className={classNames({
        [styles.close]: true,
        [styles.withLabel]: showLabel,
        [styles.top]: top,
        [styles.right]: right,
        [styles.left]: left,
        [styles.bottom]: bottom,
      })}
      onClick={() => {
        if (onClick) {
          onClick();
        } else if (goBackOnClick) {
          history.goBack();
        } else if (document.referrer.indexOf(window.location.origin) === 0) {
          history.push(document.referrer.slice(window.location.origin.length));
        } else if (location && location.state && location.state.prevPath) {
          history.push(location.state.prevPath);
        } else {
          history.push('/');
        }
      }}
    >
      {showLabel &&
        <span className={styles.label}>
          {label || t('Close')}
        </span>
      }
      <span className={styles.icon}>
        <IconClose />
      </span>
    </div>
  );
};

Close.propTypes = {
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  goBackOnClick: PropTypes.bool,
  top: PropTypes.bool,
  right: PropTypes.bool,
  left: PropTypes.bool,
  bottom: PropTypes.bool,
};

Close.defaultProps = {
  showLabel: false,
  label: undefined,
  onClick: undefined,
  goBackOnClick: false,
  top: false,
  right: false,
  left: false,
  bottom: false,
};

export default withRouter(Close);
