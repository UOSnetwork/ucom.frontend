import PropTypes from 'prop-types';
import autosize from 'autosize';
import React, { useEffect, useRef } from 'react';
import TributeWrapper from './TributeWrapper';

const TextareaAutosize = ({ value, onChange, ...props }) => {
  const textareaEl = useRef(null);

  useEffect(() => {
    autosize(textareaEl.current);

    return () => {
      autosize.destroy(textareaEl);
    };
  }, []);

  useEffect(() => {
    autosize.update(textareaEl.current);
  }, [value]);

  return (
    <TributeWrapper onChange={onChange}>
      <textarea
        {...props}
        ref={textareaEl}
        value={value}
      />
    </TributeWrapper>
  );
};

TextareaAutosize.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextareaAutosize.defaultProps = {
  value: undefined,
};

export default TextareaAutosize;
