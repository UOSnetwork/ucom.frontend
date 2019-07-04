import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Panel from './Panel';

const PanelWrapper = (props) => {
  const [active, toggleActive] = useState(false);

  return (
    <Panel
      title={props.title}
      active={active}
      onClickToggler={() => toggleActive(!active)}
    >
      {props.children}
    </Panel>
  );
};

PanelWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PanelWrapper;
