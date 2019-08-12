import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { memo } from 'react';
import UserPick from '../UserPick';
import UserPickWithIcon from '../UserPickWithIcon';
import { formatRate, formatScaledImportance } from '../../utils/rate';
import styles from './styles.css';
import { filterURL } from '../../utils/url';

const EntryCard = ({ userPickWithIcon, ...props }) => {
  let LinkTag;

  if (props.disabledLink || !props.url) {
    LinkTag = 'span';
  } else if (props.isExternal) {
    LinkTag = 'a';
  } else {
    LinkTag = Link;
  }

  return (
    <div
      className={classNames({
        [styles.entryCard]: true,
        [styles.disableAvatar]: props.disableAvatar,
        [styles.withRate]: !props.disableRate,
      })}
    >
      {!props.disableAvatar &&
        <div className={styles.userPick}>
          <LinkTag
            title={props.title}
            to={props.url}
            href={filterURL(props.url)}
            target={props.isExternal ? '_blank' : undefined}
          >
            {!userPickWithIcon ? (
              <UserPick
                shadow
                src={props.avatarSrc}
                organization={props.organization}
                isExternal={props.isExternal}
              />
            ) : (
              <UserPickWithIcon {...userPickWithIcon} />
            )}
          </LinkTag>
        </div>
      }
      <div className={styles.title}>
        <LinkTag
          title={props.title}
          to={props.url}
          href={filterURL(props.url)}
          target={props.isExternal ? '_blank' : undefined}
        >
          {props.title}
        </LinkTag>
      </div>
      <div className={styles.nickname}>
        <LinkTag
          title={props.title}
          to={props.url}
          href={filterURL(props.url)}
          target={props.isExternal ? '_blank' : undefined}
        >
          {props.disableSign ? null : props.organization ? '/' : '@'}{props.nickname}
        </LinkTag>
      </div>
      {!props.disableRate &&
        <div className={styles.rate}>
          {typeof props.scaledImportance !== 'undefined' ?
            formatScaledImportance(props.scaledImportance) :
            formatRate(props.currentRate, true)}
        </div>
      }
    </div>
  );
};

EntryCard.propTypes = {
  userPickWithIcon: PropTypes.shape(UserPickWithIcon.propTypes),
  organization: PropTypes.bool,
  avatarSrc: PropTypes.string,
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  currentRate: PropTypes.number,
  scaledImportance: PropTypes.number,
  disabledLink: PropTypes.bool,
  disableRate: PropTypes.bool,
  disableSign: PropTypes.bool,
  disableAvatar: PropTypes.bool,
  isExternal: PropTypes.bool,
};

EntryCard.defaultProps = {
  userPickWithIcon: undefined,
  organization: false,
  avatarSrc: undefined,
  currentRate: undefined,
  scaledImportance: undefined,
  disabledLink: false,
  disableRate: false,
  disableSign: false,
  disableAvatar: false,
  isExternal: false,
  url: undefined,
};

export * from './wrappers';
export default memo(EntryCard);
export const EntryCardComponent = EntryCard;
