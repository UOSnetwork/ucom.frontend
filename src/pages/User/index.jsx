import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import UserHead from '../../components/User/UserHead/index';
import LayoutBase from '../../components/Layout/LayoutBase';
import { selectUser } from '../../store/selectors/user';
import {
  fetchUserPageData,
  trustUser,
  untrustUser,
  fetchUserTrustedBy,
  fetchUserFollowsOrganizations,
} from '../../actions/users';
import { postsFetch } from '../../actions/posts';
import { getUserById } from '../../store/users';
import urls from '../../utils/urls';
import Feed from '../../components/Feed/FeedUser';
import { USER_WALL_FEED_ID, FEED_PER_PAGE } from '../../utils/feed';
import { feedGetUserPosts } from '../../actions/feed';
import NotFoundPage from '../NotFoundPage';
import Footer from '../../components/Footer';
import EntrySocialNetworks from '../../components/EntrySocialNetworks';
import EntryCreatedAt from '../../components/EntryCreatedAt';
import EntryContacts from '../../components/EntryContacts';
import EntryAbout from '../../components/EntryAbout';
import EntryListSection from '../../components/EntryListSection';
import Trust from '../../components/Trust';
import { getUserName, userIsOwner } from '../../utils/user';
import { authShowPopup } from '../../actions/auth';
import { addErrorNotification } from '../../actions/notifications';
import { parseResponseError } from '../../utils/errors';
import { restoreActiveKey } from '../../utils/keys';
import { getOrganizationByIds } from '../../store/organizations';
import PostPopup from './Post';
import withLoader from '../../utils/withLoader';

const UserPage = (props) => {
  const userIdOrName = props.match.params.userId;
  const [loaded, setLoaded] = useState(false);
  const [trustedByUsersIds, setTrustedByUsersIds] = useState([]);
  const [trustedByMetadata, setTrustedByMetadata] = useState({});
  const [trustLoading, setTrustLoading] = useState(false);
  const [organizationsIds, setOrganizationsIds] = useState([]);
  const [organizationsPopupIds, setOrganizationsPopupIds] = useState([]);
  const [organizationsMetadata, setOrganizationsMetadata] = useState({});
  const user = getUserById(props.users, userIdOrName);

  const fetchUserData = async () => {
    try {
      const data = await withLoader(props.dispatch(fetchUserPageData({
        userIdentity: userIdOrName,
      })));
      const organizationsIds = data.oneUserFollowsOrganizations.data.map(i => i.id);

      setTrustedByUsersIds(data.oneUserTrustedBy.data.map(i => i.id));
      setTrustedByMetadata(data.oneUserTrustedBy.metadata);
      setOrganizationsIds(organizationsIds);
      setOrganizationsPopupIds(organizationsIds);
      setOrganizationsMetadata(data.oneUserFollowsOrganizations.metadata);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
    setLoaded(true);
  };

  const fetchTrustedBy = async (page = 1) => {
    try {
      const data = await withLoader(props.dispatch(fetchUserTrustedBy({
        userIdentity: userIdOrName,
        page,
      })));
      setTrustedByUsersIds(data.data.map(i => i.id));
      setTrustedByMetadata(data.metadata);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
  };

  const submitTrust = async (isTrust) => {
    const activeKey = restoreActiveKey();
    if (!props.owner.id || !activeKey) {
      props.dispatch(authShowPopup());
      return;
    }
    setTrustLoading(true);
    try {
      await withLoader(props.dispatch((isTrust ? trustUser : untrustUser)({
        activeKey,
        userId: user.id,
        userAccountName: user.accountName,
        ownerAccountName: props.owner.accountName,
      })));
      await fetchTrustedBy(trustedByMetadata.page);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
    setTrustLoading(false);
  };

  const fetchOrganizations = async (page = 1) => {
    try {
      const data = await withLoader(props.dispatch(fetchUserFollowsOrganizations({
        userIdentity: userIdOrName,
        page,
      })));
      setOrganizationsPopupIds(data.data.map(i => i.id));
      setOrganizationsMetadata(data.metadata);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
  };

  const mapOrganizationProps = ids =>
    getOrganizationByIds(props.organizations, ids)
      .map(item => ({
        id: item.id,
        organization: true,
        title: item.title,
        avatarSrc: urls.getFileUrl(item.avatarFilename),
        url: urls.getOrganizationUrl(item.id),
        nickname: item.nickname,
        currentRate: item.currentRate,
      }));

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, [userIdOrName]);

  if (loaded && !user) {
    return <NotFoundPage />;
  } else if (!user) {
    return null;
  }

  return (
    <LayoutBase gray>
      <Switch>
        <Route path="/user/:userId/:postId" component={PostPopup} />
      </Switch>

      <div className="layout layout_profile">
        <div className="layout__header">
          <UserHead
            userId={user.id}
            trustedByUsersCount={trustedByMetadata.totalAmount}
            trustedByUsersIds={trustedByUsersIds}
            trustedByMetadata={trustedByMetadata}
            trustedByOnChangePage={fetchTrustedBy}
          />
        </div>
        <div className="layout__sidebar">
          {organizationsIds.length > 0 &&
            <EntryListSection
              limit={5}
              showViewMore={organizationsMetadata.totalAmount > organizationsIds.length}
              title="Communities"
              count={organizationsMetadata.totalAmount}
              data={mapOrganizationProps(organizationsIds)}
              popupData={mapOrganizationProps(organizationsPopupIds)}
              popupMetadata={organizationsMetadata}
              onChangePage={fetchOrganizations}
            />
          }

          <EntryContacts site={user.personalWebsiteUrl} />
          <EntrySocialNetworks urls={(user.usersSources || []).map(i => i.sourceUrl).filter(i => !!i)} />
          <EntryCreatedAt date={user.createdAt} />

          {!userIsOwner(user, props.owner) && !props.ownerIsLoading &&
            <Trust
              loading={trustLoading}
              trusted={user && user.myselfData && user.myselfData.trust}
              userName={getUserName(user)}
              userAvtarUrl={urls.getFileUrl(user.avatarFilename)}
              onClickTrust={() => submitTrust(true)}
              onClickUntrust={() => submitTrust(false)}
            />
          }
        </div>
        <div className="layout__main">
          <EntryAbout text={user.about} />
          <Feed userId={user.id} isCurrentUser={user.id === props.user.id} feedTypeId={USER_WALL_FEED_ID} />
        </div>
        <div className="layout__footer">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  owner: PropTypes.shape({
    id: PropTypes.number,
    accountName: PropTypes.string,
    myselfData: PropTypes.shape({
      trust: PropTypes.bool,
    }),
  }).isRequired,
  ownerIsLoading: PropTypes.bool,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
};

UserPage.defaultProps = {
  ownerIsLoading: true,
};

export const getUserPageData = (store, params) => {
  const userPromise = store.dispatch(fetchUserPageData({
    userIdentity: params.userId,
  }));
  const postPromise = params.postId ? store.dispatch(postsFetch({ postId: params.postId })) : null;
  const feedPromise = store.dispatch(feedGetUserPosts({
    feedTypeId: USER_WALL_FEED_ID,
    page: 1,
    perPage: FEED_PER_PAGE,
    userId: params.userId,
    userIdentity: params.userId,
  }));

  return Promise.all([userPromise, postPromise, feedPromise]);
};

export default connect(state => ({
  users: state.users,
  user: state.user.data,
  organizations: state.organizations,
  owner: selectUser(state),
  ownerIsLoading: state.user.loading,
}))(UserPage);
