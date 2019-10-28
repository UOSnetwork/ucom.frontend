import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import UserPick from '../../../UserPick';

const Trust = ({
  isTrusted, userName, avatarSrc, userUrl,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.content}>
      <div className={styles.trust}>
        <div className={styles.title}>
          {isTrusted ? t('Trusts') : t('Untrusts')}&nbsp;
          <Link to={userUrl} className="link red-hover">{userName}</Link>
        </div>
        <div className={styles.photo}>
          <UserPick src={avatarSrc} size={100} url={userUrl} />
        </div>
      </div>
    </div>
  );
};

Trust.propTypes = {
  userUrl: PropTypes.string.isRequired,
  isTrusted: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  avatarSrc: PropTypes.string.isRequired,
};

export default Trust;
