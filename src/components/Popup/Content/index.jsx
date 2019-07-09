import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import styles from './styles.css';
import IconClose from '../../Icons/Close';

const Content = (props) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 0);
  }, []);

  return (
    <div
      role="presentation"
      className={classNames({
        [styles.wrapper]: true,
        [styles.fullHeight]: props.fullHeight,
        [styles.fullWidth]: props.fullWidth,
        [styles.fixWidth]: props.fixWidth,
        [styles.screen]: props.screen,
      })}
    >
      <div
        className={classNames({
          [styles.content]: true,
          [styles.walletAction]: props.walletAction,
          [styles.roundBorders]: props.roundBorders,
          [styles.fixWidth]: props.fixWidth,
          [styles.active]: active,
        })}
      >
        {props.onClickClose &&
          <div
            role="presentation"
            className={styles.close}
            onClick={props.onClickClose}
          >
            {props.closeText ? (
              <span className={styles.text}>
                {props.closeText}
              </span>
            ) : (
              <span className={styles.icon}>
                <IconClose />
              </span>
            )}
          </div>
        }
        {props.children}
      </div>
    </div>
  );
};

Content.propTypes = {
  children: PropTypes.node.isRequired,
  onClickClose: PropTypes.func,
  walletAction: PropTypes.bool,
  roundBorders: PropTypes.bool,
  closeText: PropTypes.string,
  fixWidth: PropTypes.bool,
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  screen: PropTypes.bool,
};

Content.defaultProps = {
  onClickClose: undefined,
  walletAction: false,
  roundBorders: true,
  closeText: undefined,
  fixWidth: true,
  fullHeight: false,
  fullWidth: false,
  screen: false,
};

export default memo(Content);
