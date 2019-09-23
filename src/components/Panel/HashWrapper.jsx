import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Panel from './index';

const PanelHashWrapper = (props) => {
  const [active, setActive] = useState(false);

  const onChangeHash = () => {
    if (props.hash === window.location.hash) {
      setActive(true);
    }
  };

  useEffect(() => {
    window.addEventListener('hashchange', onChangeHash);
    onChangeHash();

    return () => {
      window.removeEventListener('hashchange', onChangeHash);
    };
  }, []);

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

PanelHashWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  hash: PropTypes.string.isRequired,
};

export default PanelHashWrapper;
