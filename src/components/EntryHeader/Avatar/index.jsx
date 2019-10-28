import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, memo } from 'react';
import styles from './styles.css';
import IconUpload from './IconUpload';
import UserPick from '../../UserPick';
import DropzoneWrapper from '../../DropzoneWrapper';

const Avatar = (props) => {
  const { t } = useTranslation();
  const [dropActive, setDropActive] = useState(false);

  return (
    <div
      className={classNames({
        [styles.avatar]: true,
        [styles.organization]: props.organization,
      })}
    >
      <UserPick
        stretch
        organization={props.organization}
        src={props.src}
        alt={props.alt}
      />

      {props.changeEnabled &&
        <DropzoneWrapper
          multiple={false}
          accept="image/jpeg, image/png, image/gif"
          className={classNames({
            [styles.upload]: true,
            [styles.uploadActive]: dropActive,
          })}
          onDragEnter={() => setDropActive(true)}
          onDragLeave={() => setDropActive(false)}
          onDrop={() => setDropActive(false)}
          onChange={props.onChange}
        >
          <span className={styles.uploadIcon}>
            <IconUpload />
          </span>
          <span className={styles.uploadLabel}>{t('Upload')}</span>
        </DropzoneWrapper>
      }
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  changeEnabled: PropTypes.bool,
  onChange: PropTypes.func,
  organization: PropTypes.bool,
};

Avatar.defaultProps = {
  src: null,
  alt: null,
  changeEnabled: false,
  organization: false,
  onChange: null,
};

export default memo(Avatar);
