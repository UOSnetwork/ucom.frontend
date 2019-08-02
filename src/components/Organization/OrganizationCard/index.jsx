import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import UserPick from '../../UserPick';
import { formatRate } from '../../../utils/rate';
import styles from './styles.css';

// TODO: Remove and replace to Entry Card
const OrganizationCard = (props) => {
  const LinkTag = props.disabledLink ? 'span' : Link;

  return (
    <div className={styles.organizationCard}>
      <div className={styles.userPick}>
        <LinkTag title={props.title} to={props.url}>
          <UserPick shadow organization src={props.avatarSrc} />
        </LinkTag>
      </div>
      <div className={styles.title}>
        <LinkTag title={props.title} to={props.url}>{props.title}</LinkTag>
      </div>
      <div className={styles.nickname}>
        <LinkTag title={props.title} to={props.url}>/{props.nickname}</LinkTag>
      </div>
      <div className={styles.rate}>
        {formatRate(props.currentRate)}°
      </div>
    </div>
  );
};

OrganizationCard.propTypes = {
  avatarSrc: PropTypes.string,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  currentRate: PropTypes.number,
  disabledLink: PropTypes.bool,
};

OrganizationCard.defaultProps = {
  avatarSrc: null,
  currentRate: null,
  disabledLink: false,
};

export default OrganizationCard;
