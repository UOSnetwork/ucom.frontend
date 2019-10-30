import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from '../Section/styles.css';
import { extractHostname, validUrl } from '../../utils/url';

const EntryContacts = (props) => {
  const { t } = useTranslation();

  if (!props.phone && !props.email && !validUrl(props.site)) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.title}>{t('Contacts')}</div>
      <div className={styles.content}>
        {props.phone &&
          <p><a className="red-hover" href={`tel:${props.phone}`}>{props.phone}</a></p>
        }
        {props.email &&
          <p><a className="red-hover" href={`mailto:${props.email}`}>{props.email}</a></p>
        }
        {validUrl(props.site) &&
          <p><a className="red-hover" target="_blank" rel="noopener noreferrer" href={props.site}>{extractHostname(props.site)}</a></p>
        }
      </div>
    </div>
  );
};

EntryContacts.propTypes = {
  phone: PropTypes.string,
  email: PropTypes.string,
  site: PropTypes.string,
};

EntryContacts.defaultProps = {
  phone: null,
  email: null,
  site: null,
};

export default memo(EntryContacts);
