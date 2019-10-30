import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import DropzoneWrapper from '../DropzoneWrapper';

const DragAndDrop = (props) => {
  const { t } = useTranslation();

  return (
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
          props.onMultipleImages(files);
        }}
      />
      <div className={styles.dropText}>{t('Drop image here')}</div>
    </div>
  );
};

DragAndDrop.propTypes = {
  onMultipleImages: PropTypes.func.isRequired,
  dropOnForm: PropTypes.bool.isRequired,
};

export default DragAndDrop;
