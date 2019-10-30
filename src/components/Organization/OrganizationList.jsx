import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, Fragment } from 'react';
import { getOrganizationById } from '../../store/organizations';
import EntryCard from '../EntryCard';
import OrganizationListPopup from './OrganizationListPopup';
import OrganizationListPopupMore from './OrganizationListPopupMore';
import urls from '../../utils/urls';
import styles from '../List/styles.css';

// TODO: Remove
const OrganizationList = (props) => {
  const { t } = useTranslation();
  const [popupVisibility, setPopupVisibility] = useState(false);

  if (!props.organizationsIds.length) {
    return null;
  }

  const visibleOrganizations = props.organizationsIds
    .slice(0, props.limit)
    .map(id => getOrganizationById(props.organizations, id))
    .filter(item => item && item.id);

  return (
    <Fragment>
      {visibleOrganizations.map(item => (
        <Link
          key={item.id}
          className={styles.item}
          to={urls.getOrganizationUrl(item.id)}
        >
          <EntryCard
            disabledLink
            organization
            title={item.title}
            nickname={item.nickname}
            currentRate={item.currentRate}
            avatarSrc={urls.getFileUrl(item.avatarFilename)}
            url={urls.getOrganizationUrl(item.id)}
          />
        </Link>
      ))}

      {props.organizationsIds.length > props.limit &&
        <div className={styles.more}>
          <span
            role="presentation"
            className={styles.moreLink}
            onClick={() => {
              setPopupVisibility(true);
              if (props.loadMore) {
                props.loadMore();
              }
            }}
          >
            {t('View All')}
          </span>
        </div>
      }

      {popupVisibility && (
        props.tagTitle ? (
          <OrganizationListPopupMore
            organizationsIds={props.organizationsIds}
            tagTitle={props.tagTitle}
            onClickClose={() => setPopupVisibility(false)}
          />
        ) : (
          <OrganizationListPopup
            organizationsIds={props.organizationsIds}
            onClickClose={() => setPopupVisibility(false)}
          />
        )
      )}
    </Fragment>
  );
};

OrganizationList.propTypes = {
  organizationsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  limit: PropTypes.number,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  loadMore: PropTypes.func,
  tagTitle: PropTypes.string,
};

OrganizationList.defaultProps = {
  limit: null,
  loadMore: null,
  tagTitle: null,
};

export default connect(state => ({
  organizations: state.organizations,
}))(OrganizationList);
