import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import DropzoneWrapper from './DropzoneWrapper';
import Loading from './Loading';

const DropZone = (props) => {
  const {
    onDrop,
    text,
    multiple,
    className,
  } = props;

  return (
    <div className={classNames('drop-zone', className)}>
      <DropzoneWrapper
        className="drop-zone__input"
        multiple={multiple}
        onChange={onDrop}
      >
        <Loading className="loading_small" loading={props.loading} />
        {text && <span className="drop-zone__text">{props.text}</span>}
      </DropzoneWrapper>

    </div>
  );
};

DropZone.propTypes = {
  text: PropTypes.string,
  multiple: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

DropZone.defaultProps = {
  text: '',
  multiple: false,
  className: '',
  loading: false,
};

export default DropZone;
