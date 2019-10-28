import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState, memo } from 'react';
import MinimizedText from '../MinimizedText';
import styles from '../Section/styles.css';

const UserAbout = (props) => {
  const { t } = useTranslation();
  const [minimized, setMinimized] = useState(true);

  if (!props.text) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={`${styles.title} ${styles.forText}`}>{t('About')}</div>

      <div className={styles.content}>
        <MinimizedText
          gray
          disabledHide
          text={props.text}
          enabled={props.text.length > 280}
          minimized={minimized}
          onClickShowMore={() => setMinimized(!minimized)}
        />
      </div>
    </div>
  );
};

UserAbout.propTypes = {
  text: PropTypes.string,
};

UserAbout.defaultProps = {
  text: null,
};

export default memo(UserAbout);
