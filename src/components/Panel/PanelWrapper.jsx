import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Panel from './index';

const PanelWrapper = (props) => {
  const [active, setActive] = useState(false);

  return (
    <Panel
      title={props.title}
      active={active}
      onClickToggler={() => setActive(!active)}
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
