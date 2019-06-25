import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import UserFollowButton from '../User/UserFollowButton';
import UserCard from '../UserCard';
import { getUserById } from '../../store/users';
import { getUserName } from '../../utils/user';
import urls from '../../utils/urls';
import { selectUser } from '../../store/selectors/user';
import { getOrganizationById } from '../../store/organizations';
import OrganizationFollowButton from '.././Organization/OrganizationFollowButton';
import { formatRate } from '../../utils/rate';
import Avatar from '../Avatar';
import OrganizationIcon from '../Icons/Organization';

const OrganizationHead = (props) => {
  const organization = getOrganizationById(props.organizations, props.organizationId);

  if (!organization || !organization.usersTeam || !organization.user) {
    return null;
  }

  const user = getUserById(props.users, organization.user.id);

  if (!user) {
    return null;
  }
  if (props.isGovernance) {
    return (
      <div className="governance-head">
        <Link to={urls.getOrganizationUrl(organization.id)}>
          <Avatar
            isPost
            rounded
            BlankIcon={OrganizationIcon}
            src={urls.getFileUrl(organization.avatarFilename)}
          />
        </Link>

        <Link className="governance-head__nickname" to={urls.getOrganizationUrl(organization.id)}>
          <div >{organization.nickname}</div>
        </Link>

        <div className="toolbar__side">
          {formatRate(organization.currentRate)}°
        </div>
      </div>
    );
  }

  return (
    <div className="post-header">
      {props.isOrganization ?
        <div className="toolbar">
          <div className="toolbar__main">
            <UserCard
              size="big"
              userName={organization.nickname}
              profileLink={urls.getOrganizationUrl(organization.id)}
              avatarUrl={urls.getFileUrl(organization.avatarFilename)}
              rate={Number(organization.currentRate)}
            />
          </div>
          <div className="toolbar__side">
            <div className="post-header__follow-button">
              <OrganizationFollowButton organizationId={+organization.id} />
            </div>
          </div>
        </div> :
        <div className="toolbar">
          <div className="toolbar__main">
            <UserCard
              size="big"
              userName={getUserName(user)}
              profileLink={urls.getUserUrl(user.id)}
              avatarUrl={urls.getFileUrl(user.avatarFilename)}
              rate={Number(Math.ceil(+user.scaledImportance * 1000))}
            />
          </div>
          <div className="toolbar__side">
            <div className="post-header__follow-button">
              {props.user.id && props.user.id === user.id ? null : (
                <UserFollowButton userId={user.id} />
              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

OrganizationHead.propTypes = {
  users: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default connect(state => ({
  users: state.users,
  organizations: state.organizations,
  user: selectUser(state),
}))(OrganizationHead);
