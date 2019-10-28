import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Links from '../Links';
import styles from '../Section/styles.css';

const EntrySocialNetworks = (props) => {
  const { t } = useTranslation();

  if (!props.urls.length) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.title}>{t('Social Networks')}</div>
      <div className={styles.content}>
        <Links urls={props.urls} />
      </div>
    </div>
  );
};

EntrySocialNetworks.propTypes = {
  urls: PropTypes.arrayOf(PropTypes.string),
};

EntrySocialNetworks.defaultProps = {
  urls: [],
};

export default memo(EntrySocialNetworks, isEqual);
