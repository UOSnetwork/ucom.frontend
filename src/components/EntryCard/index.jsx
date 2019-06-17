import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import UserPick from '../UserPick/UserPick';
import { formatRate } from '../../utils/rate';
import styles from './styles.css';
import { filterURL } from '../../utils/url';

// TODO: Remove and replace another cards
const EntryCard = (props) => {
  let LinkTag;

  if (props.disabledLink || !props.url) {
    LinkTag = 'span';
  } else {
    LinkTag = props.isExternal ? 'a' : Link;
  }

  return (
    <div
      className={classNames({
        [styles.entryCard]: true,
        [styles.withRate]: !props.disableRate,
      })}
    >
      <div className={styles.userPick}>
        <LinkTag
          title={props.title}
          to={props.url}
          href={filterURL(props.url)}
          target={props.isExternal ? '_blank' : undefined}
        >
          <UserPick shadow organization={props.organization} src={props.avatarSrc} />
        </LinkTag>
      </div>
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
          {formatRate(props.currentRate)}°
        </div>
      }
    </div>
  );
};

EntryCard.propTypes = {
  organization: PropTypes.bool,
  avatarSrc: PropTypes.string,
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  currentRate: PropTypes.number,
  disabledLink: PropTypes.bool,
  disableRate: PropTypes.bool,
  disableSign: PropTypes.bool,
  isExternal: PropTypes.bool,
};

EntryCard.defaultProps = {
  organization: false,
  avatarSrc: undefined,
  currentRate: undefined,
  disabledLink: false,
  disableRate: false,
  disableSign: false,
  isExternal: false,
  url: undefined,
};

export default EntryCard;
