import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { addErrorNotification } from '../actions/notifications';
import { compressUploadedImage } from '../utils/upload';

const DropzoneWrapper = ({
  addErrorNotification, children, onChange, multiple, ...props
}) => (
  <Dropzone
    {...props}
    multiple={multiple}
    onDropAccepted={async (files) => {
      if (!onChange) {
        return;
      }

      try {
        const compressedFiles = await Promise.all(files.map(file => compressUploadedImage(file)));
        onChange(multiple ? compressedFiles : compressedFiles[0]);
      } catch (err) {
        addErrorNotification(err.message);
      }
    }}
  >
    {children}
  </Dropzone>
);

DropzoneWrapper.propTypes = {
  addErrorNotification: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  multiple: PropTypes.bool,
};

DropzoneWrapper.defaultProps = {
  multiple: false,
  children: undefined,
};

export default connect(null, {
  addErrorNotification,
})(DropzoneWrapper);
