import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { arrayMove } from 'react-sortable-hoc';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../../components/Footer';
import OrganizationHeader from '../../components/Organization/OrganizationHeader';
import { selectOwner, selectOrgById } from '../../store/selectors';
import LayoutBase from '../../components/Layout/LayoutBase';
import urls from '../../utils/urls';
import FeedUser from '../../components/Feed/FeedUser';
import { FEED_TYPE_ID_ORGANIZATION, POST_TYPE_MEDIA_ID } from '../../utils';
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
import { EntryListSectionOrgSourcesWrapper, EntryListSectionOrgAdminsWrapper } from '../../components/EntryListSection';
import * as orgPageActions from '../../actions/orgPage';
import * as orgsActions from '../../actions/organizations';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import NotFoundPage from '../NotFoundPage';
import { postsFetch } from '../../actions/posts';
import { getPublicationMetaTags } from '../../utils/posts';
import { ORGANIZATION_TYPE_ID_MULTI } from '../../utils/constants';
import * as EntityImages from '../../utils/entityImages';

const OrganizationPage = (props) => {
  const { t } = useTranslation();
  const organizationId = +props.match.params.id;
  const organization = useSelector(selectOrgById(organizationId));
  const owner = useSelector(selectOwner);
  const state = useSelector(state => state.orgPage);
  const dispatch = useDispatch();

  const getPageData = async () => {
    try {
      dispatch(orgPageActions.reset());
      await withLoader(dispatch(orgPageActions.getPageData(organizationId)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const getOrganization = async () => {
    try {
      await withLoader(dispatch(orgsActions.getOrganization(organizationId)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const getFollowedByPopup = async (page) => {
    try {
      await withLoader(dispatch(orgPageActions.getFollowedByPopup(organizationId, page)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  useEffect(() => {
    getOrganization();
    getPageData();
  }, [organizationId]);

  if (state.loaded && !organization) {
    return <NotFoundPage />;
  }

  return (
    <LayoutBase gray>
      <Switch>
        <Route path="/communities/:organizationId/profile" component={ProfilePopup} />
        <Route path="/communities/:organizationId/:postId" component={PostPopup} />
      </Switch>

      <div className="layout layout_profile">
        <div className="layout__header">
          <OrganizationHeader
            organizationId={organizationId}
            followedByCount={state.followedBy.metadata.totalAmount}
            followedByUserIds={state.followedBy.ids}
            followedByPopupUserIds={state.followedByPopup.ids}
            followedByPopupMetadata={state.followedByPopup.metadata}
            followedByOnChangePage={getFollowedByPopup}
          />
        </div>

        <div className="layout__sidebar">
          <EntryListSectionOrgAdminsWrapper
            orgId={organizationId}
            limit={3}
          />

          <EntryListSectionOrgSourcesWrapper
            orgId={organizationId}
            limit={3}
          />

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
              editable={organization.organizationTypeId === ORGANIZATION_TYPE_ID_MULTI && userIsTeam(owner, organization)}
              placeholder={t('Link to Article', { title: organization.title })}
              validatePostUrlFn={link => validateDiscationPostUrl(link, organizationId)}
              newDiscussionUrl={urls.getNewOrganizationDiscussionUrl(organizationId)}
              onSubmit={async (postId) => {
                try {
                  await withLoader(dispatch(setDiscussions({
                    organizationId,
                    discussions: [{ id: postId }].concat(organization.discussions.map(i => ({ id: i.id }))),
                  })));
                  await withLoader(dispatch(orgsActions.getOrganization(organizationId)));
                } catch (err) {
                  dispatch(addErrorNotificationFromResponse(err));
                }
              }}
              onSortEnd={async (e) => {
                try {
                  const discussions = arrayMove(organization.discussions, e.oldIndex, e.newIndex);
                  dispatch(orgsActions.addOrganizations([{
                    id: organizationId,
                    discussions,
                  }]));
                  await withLoader(dispatch(setDiscussions({
                    organizationId,
                    discussions: discussions.map(i => ({ id: i.id })),
                  })));
                } catch (err) {
                  dispatch(addErrorNotificationFromResponse(err));
                }
              }}
              items={organization.discussions.map(item => ({
                id: item.id,
                url: urls.getPostUrl(item),
                title: item.title,
                author: getUserName(item.user),
                authorUrl: urls.getUserUrl(item.user.id),
                commentCount: item.commentsCount,
                onClickRemove: async (id) => {
                  try {
                    await withLoader(dispatch(setDiscussions({
                      organizationId,
                      discussions: organization.discussions.filter(i => +i.id !== +id).map(i => ({ id: i.id })),
                    })));
                    await withLoader(dispatch(orgsActions.getOrganization(organizationId)));
                  } catch (err) {
                    dispatch(addErrorNotificationFromResponse(err));
                  }
                },
              }))}
            />
          }

          <FeedUser organizationId={organizationId} feedTypeId={FEED_TYPE_ID_ORGANIZATION} />
        </div>
        <div className="layout__footer">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

export const getOrganizationPageData = async (store, params) => {
  try {
    const [org, post] = await Promise.all([
      store.dispatch(orgsActions.getOrganization(params.id)),
      params.postId ? store.dispatch(postsFetch({ postId: params.postId })) : null,
      store.dispatch(orgPageActions.getPageData(params.id)),
    ]);

    if (post.postTypeId === POST_TYPE_MEDIA_ID) {
      return {
        contentMetaTags: getPublicationMetaTags(post),
      };
    }

    return {
      contentMetaTags: {
        title: org.title,
        description: (post && post.description) || org.about,
        image: EntityImages.getFirstImage(post) || urls.getFileUrl(org.avatarFilename),
      },
    };
  } catch (err) {
    throw err;
  }
};

export default OrganizationPage;
