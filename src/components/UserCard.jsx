import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Avatar from './Avatar';
import AvatarFromFile from './AvatarFromFile';
import { filterURL } from '../utils/url';

const UserCard = (props) => {
  const avatar = props.avatarUrl && typeof props.avatarUrl === 'object' ?
    <AvatarFromFile BlankIcon={props.BlankIcon} square={props.squareAvatar} rounded={props.roundedAvatar} size={props.avatarSize} file={props.avatarUrl} /> :
    <Avatar BlankIcon={props.BlankIcon} square={props.squareAvatar} rounded={props.roundedAvatar} src={props.avatarUrl} size={props.avatarSize} />;

  let LinkTag = 'span';

  if (props.profileLink) {
    LinkTag = props.profileLink.indexOf('http') === 0 ? 'a' : Link;
  }

  return (
    <div
      className={classNames(
        props.className,
        'user-card',
        { [`user-card_size_${props.size}`]: Boolean(props.size) },
      )}
    >
      <div className="user-card__inner">
        <div className="user-card__main">
          <LinkTag to={props.profileLink} href={filterURL(props.profileLink)}>{avatar}</LinkTag>
        </div>

        <div className="user-card__side">
          <div className="user-card__name">
            <LinkTag to={props.profileLink} href={filterURL(props.profileLink)}>{props.userName}</LinkTag>

            {props.userPosition && (
              <span className="user-card__position">{props.userPosition}</span>
            )}
          </div>

          {props.rate && (
            <div className="user-card__rate">{(+props.rate).toLocaleString()}°</div>
          )}

          {props.accountName && !props.rate && (
            <div
              className={classNames(
                'user-card__account',
                { [`user-card__account_theme_${props.theme}`]: Boolean(props.theme) },
              )}
            >
              {props.sign}{props.accountName}
            </div>
          )}
        </div>

        {props.caption && (
          <div className="user-card__caption">{props.caption}</div>
        )}
      </div>
    </div>
  );
};

UserCard.propTypes = {
  squareAvatar: PropTypes.bool,
  roundedAvatar: PropTypes.bool,
  userName: PropTypes.string,
  accountName: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  profileLink: PropTypes.string,
  avatarUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  avatarSize: PropTypes.string,
  sign: PropTypes.string,
  className: PropTypes.string,
  rate: PropTypes.number,
  userPosition: PropTypes.string,
  theme: PropTypes.string,
  size: PropTypes.string,
  caption: PropTypes.string,
};

UserCard.defaultProps = {
  squareAvatar: false,
  roundedAvatar: false,
  sign: '@',
};

export default UserCard;
