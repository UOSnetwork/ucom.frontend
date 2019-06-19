import { Route, Switch } from 'react-router';
import { arrayMove } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Footer from '../../components/Footer';
import OrganizationHeader from '../../components/Organization/OrganizationHeader';
import { getOrganization, addOrganizations } from '../../actions/organizations';
import { selectUser } from '../../store/selectors';
import LayoutBase from '../../components/Layout/LayoutBase';
import { getOrganizationById } from '../../store/organizations';
import urls from '../../utils/urls';
import Feed from '../../components/Feed/FeedUser';
import { ORGANIZATION_FEED_ID } from '../../utils/feed';
import OrganizationAdmins from '../../components/Organization/OrganizationAdmins';
import OrganizationSources from '../../components/Organization/OrganizationSources';
import { extractHostname } from '../../utils/url';
import EntrySocialNetworks from '../../components/EntrySocialNetworks';
import EntryLocation from '../../components/EntryLocation';
import EntryCreatedAt from '../../components/EntryCreatedAt';
import EntryContacts from '../../components/EntryContacts';
import EntryAbout from '../../components/EntryAbout';
import Discussions from '../../components/Discussions';
import { getUserName } from '../../utils/user';
import { validateDiscationPostUrl, userIsTeam } from '../../utils/organization';
import { setDiscussions } from '../../actions/organization';
import PostPopup from './Post';
import ProfilePopup from './Profile';
import withLoader from '../../utils/withLoader';

const OrganizationPage = (props) => {
  const organizationId = +props.match.params.id;
  const isExternalSource = source => source.sourceType === 'external';

  useEffect(() => {
    withLoader(props.dispatch(getOrganization(organizationId)));
  }, [organizationId]);

  const organization = getOrganizationById(props.organizations, organizationId);

  const mapSourcesProps = item => ({
    id: item.id,
    organization: isExternalSource(item) || (item.entityName && item.entityName.trim() === 'org'),
    avatarSrc: urls.getFileUrl(item.avatarFilename),
    url: urls.getSourceUrl(item),
    title: item.title,
    nickname: isExternalSource(item) ? extractHostname(item.sourceUrl) : item.nickname,
    disableRate: true,
    disableSign: isExternalSource(item),
    isExternal: isExternalSource(item),
  });

  return (
    <LayoutBase gray>
      <Switch>
        <Route path="/communities/:organizationId/profile" component={ProfilePopup} />
        <Route path="/communities/:organizationId/:postId" component={PostPopup} />
      </Switch>

      <div className="layout layout_profile">
        <div className="layout__header">
          <OrganizationHeader organizationId={organizationId} />
        </div>
        <div className="layout__sidebar">
          <OrganizationAdmins organizationId={organizationId} />
          {organization &&
            <OrganizationSources
              title="Partners"
              sources={(organization.partnershipSources || []).map(mapSourcesProps)}
            />
          }
          {organization &&
            <OrganizationSources
              title="Communities"
              sources={(organization.communitySources || []).map(mapSourcesProps)}
            />
          }
          {organization &&
            <EntryContacts
              phone={organization.phoneNumber}
              email={organization.email}
            />
          }
          {organization &&
            <EntrySocialNetworks
              urls={(organization.socialNetworks || []).filter(item => item.sourceUrl && item.sourceUrl.length > 0).map(i => i.sourceUrl)}
            />
          }
          {organization &&
            <EntryLocation
              city={organization.city}
              country={organization.country}
            />
          }
          {organization &&
            <EntryCreatedAt date={organization.createdAt} />
          }
        </div>
        <div className="layout__main">
          {organization &&
            <EntryAbout text={organization.about} />
          }

          {organization && organization.discussions &&
            <Discussions
              editable={userIsTeam(props.user, organization)}
              placeholder={`Link to ${organization.title} Article`}
              validatePostUrlFn={link => validateDiscationPostUrl(link, organizationId)}
              newDiscussionUrl={urls.getNewOrganizationDiscussionUrl(organizationId)}
              onSubmit={async (postId) => {
                await withLoader(props.dispatch(setDiscussions({
                  organizationId,
                  discussions: [{ id: postId }].concat(organization.discussions.map(i => ({ id: i.id }))),
                })));
                await withLoader(props.dispatch(getOrganization(organizationId)));
              }}
              onSortEnd={async (e) => {
                const discussions = arrayMove(organization.discussions, e.oldIndex, e.newIndex);
                props.dispatch(addOrganizations([{
                  id: organizationId,
                  discussions,
                }]));
                await withLoader(props.dispatch(setDiscussions({
                  organizationId,
                  discussions: discussions.map(i => ({ id: i.id })),
                })));
              }}
              items={organization.discussions.map(item => ({
                id: item.id,
                url: urls.getPostUrl(item),
                title: item.title,
                author: getUserName(item.user),
                authorUrl: urls.getUserUrl(item.user.id),
                commentCount: item.commentsCount,
                onClickRemove: async (id) => {
                  await withLoader(props.dispatch(setDiscussions({
                    organizationId,
                    discussions: organization.discussions.filter(i => +i.id !== +id).map(i => ({ id: i.id })),
                  })));
                  await withLoader(props.dispatch(getOrganization(organizationId)));
                },
              }))}
            />
          }

          <Feed organizationId={organizationId} feedTypeId={ORGANIZATION_FEED_ID} />
        </div>
        <div className="layout__footer">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

OrganizationPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default connect(state => ({
  user: selectUser(state),
  organizations: state.organizations,
  posts: state.posts,
}))(OrganizationPage);
