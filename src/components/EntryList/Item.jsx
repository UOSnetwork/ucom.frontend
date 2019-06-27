import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import EntryCard from '../EntryCard';
import styles from '../List/styles.css';
import { filterURL } from '../../utils/url';

const EntryListItem = (props) => {
  const LinkTag = props.isExternal ? 'a' : Link;

  return (
    <LinkTag
      key={props.id}
      to={props.url}
      href={filterURL(props.url)}
      className={styles.item}
      target={props.isExternal ? '_blank' : undefined}
    >
      <EntryCard
        {...props}
        disabledLink
      />
    </LinkTag>
  );
};

EntryListItem.propTypes = {
  ...EntryCard.propTypes,
  id: PropTypes.number.isRequired,
  follow: PropTypes.bool,
};

EntryListItem.defaultProps = {
  ...EntryCard.defaultProps,
  follow: false,
};

export default EntryListItem;
