import { memoize } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import IconUser from '../Icons/User';
import IconOrganization from '../Icons/Organization';
import IconExternal from '../Icons/External';
import memoizeResolver from '../../utils/memoizeResolver';
import styles from './styles.css';

const UserPick = (props) => {
  let BlankIcon;

  if (props.isExternal) {
    BlankIcon = IconExternal;
  } else if (props.organization) {
    BlankIcon = IconOrganization;
  } else {
    BlankIcon = IconUser;
  }

  let LinkTag;

  if (props.url && props.isExternal) {
    LinkTag = 'a';
  } else if (props.url) {
    LinkTag = Link;
  } else {
    LinkTag = 'div';
  }

  return (
    <LinkTag
      style={{
        width: props.size ? `${props.size}px` : undefined,
        height: props.size ? `${props.size}px` : undefined,
      }}
      className={classNames({
        [styles.userPick]: true,
        [styles.owner]: props.isOwner,
        [styles.stretch]: props.stretch,
        [styles.organization]: props.organization,
        [styles.shadow]: props.shadow,
      })}
      title={props.alt}
      to={props.url}
      target={props.isExternal ? '_blank' : undefined}
    >
      {props.src ? (
        <img src={props.src} alt={props.alt} />
      ) : (
        <BlankIcon />
      )}
    </LinkTag>
  );
};

UserPick.propTypes = {
  url: PropTypes.string,
  alt: PropTypes.string,
  src: PropTypes.string,
  isOwner: PropTypes.bool,
  stretch: PropTypes.bool,
  organization: PropTypes.bool,
  shadow: PropTypes.bool,
  size: PropTypes.number,
  isExternal: PropTypes.bool,
};

UserPick.defaultProps = {
  url: null,
  alt: null,
  src: null,
  isOwner: false,
  stretch: false,
  organization: false,
  shadow: false,
  size: null,
  isExternal: false,
};

export default memoize(UserPick, memoizeResolver('UserPick', Object.keys(UserPick.propTypes)));
