import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import DropzoneWrapper from '../DropzoneWrapper';

const DragAndDrop = props => (
  <div
    className={classNames({
    [styles.dragContainer]: true,
    [styles.dropOnForm]: props.dropOnForm,
  })}
  >
    <DropzoneWrapper
      className={styles.dropZonePost}
      multiple
      onChange={(files) => {
        props.onImage(files[0]);
      }}
    />
    <div className={styles.dropText}>Drop image here</div>
  </div>
);

DragAndDrop.propTypes = {
  onImage: PropTypes.func.isRequired,
  dropOnForm: PropTypes.bool.isRequired,
};

export default DragAndDrop;
