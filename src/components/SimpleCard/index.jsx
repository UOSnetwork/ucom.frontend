import { memoize } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import UserPick from '../UserPick';
import memoizeResolver from '../../utils/memoizeResolver';
import styles from './styles.css';

const SimpleCard = (props) => {
  const LinkTag = props.url ? Link : 'span';

  return (
    <div className={styles.userCard}>
      <div className={styles.avatar}>
        <UserPick isOwner={props.isOwner} url={props.url} src={props.userPickSrc} alt={props.userPickAlt} />
      </div>
      <div className={styles.name}>
        <LinkTag to={props.url}>{props.name}</LinkTag>
      </div>
      <div className={styles.rate}>{props.rate}</div>
    </div>
  );
};

SimpleCard.propTypes = {
  userPickSrc: PropTypes.string,
  userPickAlt: PropTypes.string,
  name: PropTypes.string.isRequired,
  rate: PropTypes.string.isRequired,
  url: PropTypes.string,
  isOwner: PropTypes.bool,
};

SimpleCard.defaultProps = {
  userPickSrc: null,
  userPickAlt: null,
  url: PropTypes.null,
  isOwner: false,
};

export * from './wrappers';
export default memoize(SimpleCard, memoizeResolver('SimpleCard', Object.keys(SimpleCard.propTypes)));
