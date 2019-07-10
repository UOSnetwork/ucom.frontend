import PropTypes from 'prop-types';
import React from 'react';
import IconPlus from '../Icons/Plus';
import IconMinus from '../Icons/Minus';

// TODO: Replace to css modules
const Panel = props => (
  <div className="panel" >
    {props.id &&
      <div className="anchor" id={props.id} />
    }

    <div
      role="presentation"
      className="panel__header"
      onClick={props.onClickToggler}
    >
      <div className="panel__title">{props.title}</div>
      <div className="panel__toggler">
        {props.active ? <IconMinus /> : <IconPlus /> }
      </div>
    </div>

    {props.active &&
      <div className="panel__content">
        {props.children}
      </div>
    }
  </div>
);

Panel.propTypes = {
  id: PropTypes.string,
  onClickToggler: PropTypes.func,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Panel.defaultProps = {
  id: undefined,
  onClickToggler: undefined,
  active: false,
};

export { default as PanelWrapper } from './PanelWrapper';
export { default as PanelHashWrapper } from './HashWrapper';
export default Panel;
