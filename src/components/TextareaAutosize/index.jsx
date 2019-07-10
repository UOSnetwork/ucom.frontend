import classNames from 'classnames';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import React, { useEffect, useRef, useState } from 'react';
import TributeWrapper from '../TributeWrapper';
import styles from './styles.css';

const TextareaAutosize = ({
  value, error, submited, onChange, className, ...props
}) => {
  const [dirty, setDirty] = useState(false);
  const textareaEl = useRef(null);

  useEffect(() => {
    if (submited) {
      setDirty(true);
    }
  }, [submited]);

  useEffect(() => {
    autosize(textareaEl.current);

    return () => {
      autosize.destroy(textareaEl.current);
    };
  }, []);

  useEffect(() => {
    autosize.update(textareaEl.current);
  }, [value]);

  return (
    <div>
      <TributeWrapper
        onChange={(value) => {
          setDirty(true);
          onChange(value);
        }}
      >
        <textarea
          {...props}
          ref={textareaEl}
          value={value || ''}
          className={className || classNames({
            [styles.textarea]: true,
            [styles.error]: error && dirty,
          })}
        />
      </TributeWrapper>
      {error && dirty &&
        <div className={styles.errorMessage}>
          {error}
        </div>
      }
    </div>
  );
};

TextareaAutosize.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  submited: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TextareaAutosize.defaultProps = {
  value: undefined,
  error: undefined,
  submited: false,
  className: undefined,
};

export default TextareaAutosize;
