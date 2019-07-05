import { isFunction } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';
import { addErrorNotification } from '../actions/notifications';
import { compressUploadedImage } from '../utils/upload';

const DropzoneWrapper = ({
  children, onChange, multiple, ...props
}) => {
  const dispatch = useDispatch();

  return (
    <Dropzone
      {...props}
      multiple={multiple}
      onDropAccepted={async (files) => {
        if (!isFunction(onChange)) {
          return;
        }

        try {
          const compressedFiles = await Promise.all(files.map(compressUploadedImage));

          onChange(multiple ? compressedFiles : compressedFiles[0]);
        } catch (err) {
          dispatch(addErrorNotification(err.message));
        }
      }}
    >
      {children}
    </Dropzone>
  );
};

DropzoneWrapper.propTypes = {
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  multiple: PropTypes.bool,
};

DropzoneWrapper.defaultProps = {
  multiple: false,
  children: undefined,
};

export default DropzoneWrapper;
