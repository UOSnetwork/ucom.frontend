import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import { copyToClipboard } from '../../utils/text';
import { COPY_TO_CLIPBOARD_SUCCESS_MESSAGE } from '../../utils/constants';
import { addSuccessNotification } from '../../actions/notifications';

const CopyPanel = props => (
  <div
    className={classNames({
      [styles.copyPanel]: true,
      [styles.noLabel]: !props.label,
    })}
  >
    {props.label &&
      <div className={styles.label}>
        {props.label}
      </div>
    }
    <div className={styles.value}>
      {props.value}
    </div>
    <div
      role="presentation"
      className="link red"
      onClick={() => {
        copyToClipboard(props.value);
        props.dispatch(addSuccessNotification(COPY_TO_CLIPBOARD_SUCCESS_MESSAGE));
        if (props.onCopy) {
          props.onCopy();
        }
      }}
    >
      Copy
    </div>
  </div>
);

CopyPanel.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
};

CopyPanel.defaultProps = {
  label: undefined,
  onCopy: undefined,
};

export default connect()(CopyPanel);
