import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import UserHead from '../components/User/UserHead/index';
import LayoutBase from '../components/Layout/LayoutBase';
import { selectUser } from '../store/selectors/user';
import { fetchUserPageData, trustUser, untrustUser, fetchUserTrustedBy } from '../actions/users';
import { fetchPost } from '../actions/posts';
import { getUserById } from '../store/users';
import { getPostById } from '../store/posts';
import Popup from '../components/Popup';
import ModalContent from '../components/ModalContent';
import Post from '../components/Feed/Post/Post';
import urls from '../utils/urls';
import Feed from '../components/Feed/FeedUser';
import { USER_WALL_FEED_ID, FEED_PER_PAGE } from '../utils/feed';
import { feedGetUserPosts } from '../actions/feed';
import loader from '../utils/loader';
import NotFoundPage from './NotFoundPage';
import Footer from '../components/Footer';
import EntrySocialNetworks from '../components/EntrySocialNetworks';
import EntryCreatedAt from '../components/EntryCreatedAt';
import EntryContacts from '../components/EntryContacts';
import EntryAbout from '../components/EntryAbout';
import EntryListSection from '../components/EntryListSection';
import Trust from '../components/Trust';
import { getUserName, userIsOwner } from '../utils/user';
import { authShowPopup } from '../actions/auth';
import { addErrorNotification } from '../actions/notifications';
import { parseResponseError } from '../utils/errors';
import { restoreActiveKey } from '../utils/keys';
import Profile from './Profile';

const UserPage = (props) => {
  const userIdOrName = props.match.params.userId;
  const postId = +props.match.params.postId;
  const [loaded, setLoaded] = useState(false);
  const [trustedByUsersIds, setTrustedByUsersIds] = useState([]);
  const [trustedByMetadata, setTrustedByMetadata] = useState({});
  const [trustLoading, setTrustLoading] = useState(false);
  const [profileEditVisible, setProfileEditVisible] = useState(false);
  const user = getUserById(props.users, userIdOrName);
  const post = getPostById(props.posts, postId);

  const fetchUserData = async () => {
    loader.start();
    try {
      const data = await props.dispatch(fetchUserPageData({
        userIdentity: userIdOrName,
      }));
      setTrustedByUsersIds(data.oneUserTrustedBy.data.map(i => i.id));
      setTrustedByMetadata(data.oneUserTrustedBy.metadata);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
    loader.done();
    setLoaded(true);
  };

  const fetchTrustedBy = async (page = 1) => {
    loader.start();
    try {
      const data = await props.dispatch(fetchUserTrustedBy({
        userIdentity: userIdOrName,
        page,
      }));
      setTrustedByUsersIds(data.data.map(i => i.id));
      setTrustedByMetadata(data.metadata);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
    loader.done();
  };

  const fetchPostData = async () => {
    if (!postId) {
      return;
    }
    loader.start();
    try {
      props.dispatch(fetchPost(postId));
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
    loader.done();
  };

  const submitTrust = async (isTrust) => {
    const activeKey = restoreActiveKey();
    if (!props.owner.id || !activeKey) {
      props.dispatch(authShowPopup());
      return;
    }
    loader.start();
    setTrustLoading(true);
    try {
      await props.dispatch((isTrust ? trustUser : untrustUser)({
        activeKey,
        userId: user.id,
        userAccountName: user.accountName,
        ownerAccountName: props.owner.accountName,
      }));
      await fetchTrustedBy(trustedByMetadata.page);
    } catch (e) {
      const errorMessage = parseResponseError(e)[0].message;
      props.dispatch(addErrorNotification(errorMessage));
    }
    loader.done();
    setTrustLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, [userIdOrName]);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  if (loaded && !user) {
    return <NotFoundPage />;
  } else if (!user) {
    return null;
  }

  return (
    <LayoutBase gray>
      {/* TODO: Disable scroll to top */}
      {post &&
        <Popup onClickClose={() => props.history.push(urls.getUserUrl(user.id))}>
          <ModalContent mod="post">
            <Post id={post.id} postTypeId={post.postTypeId} />
          </ModalContent>
        </Popup>
      }

      {profileEditVisible &&
        <Profile
          onClickClose={() => {
            setProfileEditVisible(false);
          }}
        />
      }

      <div className="layout layout_profile">
        <div className="layout__header">
          <UserHead
            userId={user.id}
            trustedByUsersCount={trustedByMetadata.totalAmount}
            trustedByUsersIds={trustedByUsersIds}
            trustedByMetadata={trustedByMetadata}
            trustedByOnChangePage={fetchTrustedBy}
            onClickEdit={() => setProfileEditVisible(true)}
          />
        </div>
        <div className="layout__sidebar">
          {user.organizations &&
            <EntryListSection
              title="Communities"
              count={user.organizations.length}
              data={user.organizations.map(item => ({
                id: item.id,
                organization: true,
                title: item.title,
                avatarSrc: urls.getFileUrl(item.avatarFilename),
                url: urls.getOrganizationUrl(item.id),
                nickname: item.nickname,
                currentRate: item.currentRate,
              }))}
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
          <Feed userId={user.id} feedTypeId={USER_WALL_FEED_ID} />
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
      postId: PropTypes.string,
    }),
  }).isRequired,
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  posts: PropTypes.objectOf(PropTypes.any).isRequired,
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
};

UserPage.defaultProps = {
  ownerIsLoading: true,
};

export const getUserPageData = (store, params) => {
  const userPromise = store.dispatch(fetchUserPageData({
    userIdentity: params.userId,
  }));
  const postPromise = params.postId ? store.dispatch(fetchPost(params.postId)) : null;
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
  posts: state.posts,
  owner: selectUser(state),
  ownerIsLoading: state.user.loading,
}))(UserPage);
