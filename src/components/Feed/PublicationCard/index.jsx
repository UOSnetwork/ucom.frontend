import classNames from 'classnames';
import { memoize } from 'lodash';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import UserPick from '../../UserPick';
import memoizeResolver from '../../../utils/memoizeResolver';

const PublicationCard = ({
  coverSrc, coverAlt, rating, title, userAvatarSrc, userName, userUrl, postUrl,
}) => (
  <div
    className={classNames({
      [styles.publicationCard]: true,
      [styles.noCover]: !coverSrc,
    })}
  >
    <div className={styles.inner}>
      <Link className={styles.cover} to={postUrl}>
        {coverSrc &&
          <img src={coverSrc} alt={coverAlt} />
        }
      </Link>
      <div className={styles.rate}>{rating}</div>
      <Link
        to={postUrl}
        className={classNames({
          [styles.title]: true,
          [styles.large]: title.length < 34,
          [styles.small]: title.length > 129,
        })}
      >
        {title}
      </Link>
      <div className={styles.user}>
        <span className={styles.by}>by</span>
        <UserPick shadow size={24} src={userAvatarSrc} alt={userName} url={userUrl} />
        <Link to={userUrl} className={styles.userName}>{userName}</Link>
      </div>
    </div>
  </div>
);

PublicationCard.propTypes = {
  coverSrc: PropTypes.string,
  coverAlt: PropTypes.string,
  rating: PropTypes.string,
  title: PropTypes.string.isRequired,
  userAvatarSrc: PropTypes.string,
  userName: PropTypes.string.isRequired,
  userUrl: PropTypes.string.isRequired,
  postUrl: PropTypes.string.isRequired,
};

PublicationCard.defaultProps = {
  coverSrc: undefined,
  coverAlt: undefined,
  rating: undefined,
  userAvatarSrc: undefined,
};

export * from './wrappers';
export default memoize(PublicationCard, memoizeResolver('PublicationCard', Object.keys(PublicationCard.propTypes)));
