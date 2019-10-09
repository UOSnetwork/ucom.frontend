import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import utilsActions from '../../actions/utils';

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
        props.dispatch(utilsActions.copyToClipboard(props.value));
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
