import { memoize } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { memo } from 'react';
import UserPick from '../UserPick/UserPick';
import { getUserById } from '../../store/users';
import { getUserName } from '../../utils/user';
import urls from '../../utils/urls';
import styles from './styles.css';
import { formatRate } from '../../utils/rate';

export const MyUserCard = (props) => {
  const LinkTag = props.url ? Link : 'span';

  return (
    <div className={styles.userCard}>
      <div className={styles.avatar}>
        <UserPick isOwner={props.isOwner} url={props.url} src={props.userPickSrc} alt={props.userPickAlt} />
      </div>
      <div className={styles.name}>
        <LinkTag to={props.url}>{props.name}</LinkTag>
      </div>
      <div className={styles.rate}>
        {formatRate(props.rate)}°
      </div>
    </div>
  );
};

MyUserCard.propTypes = {
  userPickSrc: PropTypes.string,
  userPickAlt: PropTypes.string,
  name: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  url: PropTypes.string,
  isOwner: PropTypes.bool,
};

MyUserCard.defaultProps = {
  userPickSrc: null,
  userPickAlt: null,
  url: PropTypes.null,
  isOwner: false,
};

export default connect(memoize((state, props) => {
  const user = getUserById(state.users, props.userId);

  return ({
    ...props,
    userPickSrc: user ? urls.getFileUrl(user.avatarFilename) : null,
    userPickAlt: getUserName(user),
    url: user ? urls.getUserUrl(user.id) : null,
    name: getUserName(user),
    rate: user ? user.currentRate : null,
  });
}, (state, props) => {
  const user = getUserById(state.users, props.userId);

  return `${props.userId}.${user.currentRate}.${user.avatarFilename}.${props.isOwner}`;
}))(memo(MyUserCard));
