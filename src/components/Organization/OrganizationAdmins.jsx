import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../Section/styles.css';
import { getOrganizationById } from '../../store/organizations';
import EntryList from '../EntryList';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';

const OrganizationAdmins = (props) => {
  const organization = getOrganizationById(props.organizations, props.organizationId);

  if (!organization || !organization.usersTeam || !organization.user) {
    return null;
  }

  const users = organization.usersTeam
    .filter(item => item.usersTeamStatus === 1)
    .concat([organization.user]);

  return (
    <div className={styles.section}>
      <div className={styles.title}>Administrators {users.length}</div>
      <div className={styles.content}>
        <EntryList
          title="Administrators"
          data={users.map(item => ({
            id: item.id,
            avatarSrc: urls.getFileUrl(item.avatarFilename),
            url: urls.getUserUrl(item.id),
            title: getUserName(item),
            nickname: item.accountName,
            scaledImportance: item.scaledImportance,
            follow: true,
          }))}
        />
      </div>
    </div>
  );
};

OrganizationAdmins.propTypes = {
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  organizationId: PropTypes.number.isRequired,
};

export default connect(state => ({
  organizations: state.organizations,
}))(OrganizationAdmins);
