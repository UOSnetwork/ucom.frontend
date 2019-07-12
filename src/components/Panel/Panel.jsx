import PropTypes from 'prop-types';
import React from 'react';
import IconPlus from '../Icons/Plus';
import IconMinus from '../Icons/Minus';
import styles from './styles.css';

const Panel = props => (
  <div>
    <div
      role="presentation"
      className={styles.header}
      onClick={props.onClickToggler}
    >
      <div className={styles.title}>{props.title}</div>
      <div>{props.active ? <IconMinus /> : <IconPlus /> }</div>
    </div>

    {props.active && <div>{props.children}</div>}
  </div>
);

Panel.propTypes = {
  onClickToggler: PropTypes.func,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Panel.defaultProps = {
  onClickToggler: undefined,
  active: false,
};

export { default as PanelWrapper } from './PanelWrapper';
export { default as PanelHashWrapper } from './HashWrapper';
export default Panel;
