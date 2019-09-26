import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import UserPick from '../UserPick';
import { UserFollowButton, OrgFollowButton } from '../FollowButton';

const EntrySubHeader = ({
  square, name, url, rate, userId, orgId, showFollow, avatarSrc, label,
}) => (
  <div
    className={classNames({
      [styles.subHeader]: true,
      [styles.subHeaderSquare]: square,
    })}
  >
    <div className={styles.userPick}>
      <UserPick shadow stretch organization={!!orgId} url={url} alt={name} src={avatarSrc} />
    </div>
    <div className={styles.name}>
      <Link className="link red-hover" to={url}>{name}</Link>
      {label && <span className={styles.label}>{label}</span>}
    </div>
    <div className={styles.rate}>{rate}</div>

    {showFollow && (userId || orgId) &&
      <div className={styles.followLink}>
        {orgId ? (
          <OrgFollowButton asLink orgId={orgId} />
        ) : (
          <UserFollowButton asLink userId={userId} />
        )}
      </div>
    }
  </div>
);

EntrySubHeader.propTypes = {
  square: PropTypes.bool,
  avatarSrc: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  rate: PropTypes.string,
  userId: PropTypes.number,
  orgId: PropTypes.number,
  showFollow: PropTypes.bool,
  label: PropTypes.string,
};

EntrySubHeader.defaultProps = {
  square: false,
  avatarSrc: undefined,
  name: undefined,
  url: undefined,
  rate: undefined,
  userId: undefined,
  orgId: undefined,
  showFollow: true,
  label: undefined,
};

export * from './wrappers';
export default memo(EntrySubHeader);
