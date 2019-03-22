import { arrayMove } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Footer from '../components/Footer';
import OrganizationHeader from '../components/Organization/OrganizationHeader';
import { getOrganization, addOrganizations } from '../actions/organizations';
import { selectUser } from '../store/selectors';
import LayoutBase from '../components/Layout/LayoutBase';
import { getOrganizationById } from '../store/organizations';
import { getPostById } from '../store/posts';
import Popup from '../components/Popup';
import ModalContent from '../components/ModalContent';
import Post from '../components/Feed/Post/Post';
import urls from '../utils/urls';
import { fetchPost } from '../actions/posts';
import Feed from '../components/Feed/FeedUser';
import { ORGANIZATION_FEED_ID } from '../utils/feed';
import OrganizationAdmins from '../components/Organization/OrganizationAdmins';
import OrganizationSources from '../components/Organization/OrganizationSources';
import { extractHostname } from '../utils/url';
import EntrySocialNetworks from '../components/EntrySocialNetworks';
import EntryLocation from '../components/EntryLocation';
import EntryCreatedAt from '../components/EntryCreatedAt';
import EntryContacts from '../components/EntryContacts';
import EntryAbout from '../components/EntryAbout';
import Discussions from '../components/Discussions';
import { getUserName } from '../utils/user';
import { validateDiscationPostUrl, userIsTeam } from '../utils/organization';
import { setDiscussions } from '../actions/organization';
import loader from '../utils/loader';

const OrganizationPage = (props) => {
  const organizationId = +props.match.params.id;
  const postId = +props.match.params.postId;
  const isExternalSource = source => source.sourceType === 'external';

  useEffect(() => {
    props.dispatch(getOrganization(organizationId));
  }, [organizationId]);

  useEffect(() => {
    if (postId) {
      props.dispatch(fetchPost(postId));
    }
  }, [postId]);

  const organization = getOrganizationById(props.organizations, organizationId);
  const post = getPostById(props.posts, postId);

  if (!organization || !organization.discussions) {
    return null;
  }

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
      {Boolean(post) &&
        <Popup onClickClose={() => props.history.push(urls.getOrganizationUrl(organizationId))}>
          <ModalContent mod="post">
            <Post id={post.id} postTypeId={post.postTypeId} />
          </ModalContent>
        </Popup>
      }

      <div className="layout layout_profile">
        <div className="layout__header">
          <OrganizationHeader organizationId={organizationId} />
        </div>
        <div className="layout__sidebar">
          <OrganizationAdmins organizationId={organizationId} />
          <OrganizationSources
            title="Partners"
            sources={(organization.partnershipSources || []).map(mapSourcesProps)}
          />
          <OrganizationSources
            title="Communities"
            sources={(organization.communitySources || []).map(mapSourcesProps)}
          />
          <EntryContacts
            phone={organization.phoneNumber}
            email={organization.email}
          />
          <EntrySocialNetworks
            urls={(organization.socialNetworks || []).filter(item => item.sourceUrl && item.sourceUrl.length > 0).map(i => i.sourceUrl)}
          />
          <EntryLocation
            city={organization.city}
            country={organization.country}
          />
          <EntryCreatedAt date={organization.createdAt} />
        </div>
        <div className="layout__main">
          <EntryAbout text={organization.about} />

          <Discussions
            editable={userIsTeam(props.user, organization)}
            placeholder={`Link to ${organization.title} Article`}
            validatePostUrlFn={link => validateDiscationPostUrl(link, organizationId)}
            onSubmit={async (postId) => {
              loader.start();
              await props.dispatch(setDiscussions({
                organizationId,
                discussions: [{ id: postId }].concat(organization.discussions.map(i => ({ id: i.id }))),
              }));
              await props.dispatch(getOrganization(organizationId));
              loader.done();
            }}
            onSortEnd={async (e) => {
              loader.start();
              const discussions = arrayMove(organization.discussions, e.oldIndex, e.newIndex);
              props.dispatch(addOrganizations([{
                id: organizationId,
                discussions,
              }]));
              await props.dispatch(setDiscussions({
                organizationId,
                discussions: discussions.map(i => ({ id: i.id })),
              }));
              loader.done();
            }}
            items={organization.discussions.map(item => ({
              id: item.id,
              url: urls.getPostUrl(item),
              title: item.title,
              author: getUserName(item.user),
              authorUrl: urls.getUserUrl(item.user.id),
              commentCount: item.commentsCount,
              onClickRemove: async (id) => {
                loader.start();
                await props.dispatch(setDiscussions({
                  organizationId,
                  discussions: organization.discussions.filter(i => +i.id !== +id).map(i => ({ id: i.id })),
                }));
                await props.dispatch(getOrganization(organizationId));
                loader.done();
              },
            }))}
          />

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
  posts: PropTypes.objectOf(PropTypes.any).isRequired,
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
