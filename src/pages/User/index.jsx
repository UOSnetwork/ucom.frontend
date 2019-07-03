import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserHead from '../../components/User/UserHead/index';
import LayoutBase from '../../components/Layout/LayoutBase';
import { postsFetch } from '../../actions/posts';
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
import { EntryListSectionOrgsWrapper } from '../../components/EntryListSection';
import Trust from '../../components/Trust';
import { getUserName, userIsOwner } from '../../utils/user';
import { authShowPopup } from '../../actions/auth';
import { addErrorNotification } from '../../actions/notifications';
import { parseResponseError } from '../../utils/errors';
import { restoreActiveKey } from '../../utils/keys';
import PostPopup from './Post';
import ProfilePopup from './Profile';
import withLoader from '../../utils/withLoader';
import * as userPageActions from '../../actions/userPage';
import { selectUserById, selectOwner } from '../../store/selectors';

const UserPage = (props) => {
  const userIdentity = props.match.params.userId;
  const user = useSelector(selectUserById(userIdentity));
  const owner = useSelector(selectOwner);
  const state = useSelector(state => state.userPage);
  const dispatch = useDispatch();

  const trustedByOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getTrustedByPopup(userIdentity, page)));
    } catch (err) {
      console.error(err);
      const msg = parseResponseError(err)[0].message;
      dispatch(addErrorNotification(msg));
    }
  };

  const iFollowOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getIFollowPopup(userIdentity, page)));
    } catch (err) {
      console.error(err);
      const msg = parseResponseError(err)[0].message;
      dispatch(addErrorNotification(msg));
    }
  };

  const followedByOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getFollowedByPopup(userIdentity, page)));
    } catch (err) {
      console.error(err);
      const msg = parseResponseError(err)[0].message;
      dispatch(addErrorNotification(msg));
    }
  };

  const orgsPopupOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getOrgsPopup(userIdentity, page)));
    } catch (err) {
      console.error(err);
      const msg = parseResponseError(err)[0].message;
      dispatch(addErrorNotification(msg));
    }
  };

  const submitTrust = async (isTrust) => {
    try {
      const activeKey = restoreActiveKey();

      if (!owner.id || !activeKey) {
        dispatch(authShowPopup());
        return;
      }

      await withLoader(dispatch(userPageActions.submitTrust(userIdentity, isTrust, {
        activeKey,
        userId: user.id,
        userAccountName: user.accountName,
        ownerAccountName: owner.accountName,
      })));
    } catch (err) {
      console.error(err);
      const msg = parseResponseError(err)[0].message;
      dispatch(addErrorNotification(msg));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(userPageActions.reset());
    withLoader(dispatch(userPageActions.getPageData(userIdentity)));
  }, [userIdentity]);

  if (state.loaded && !user) {
    return <NotFoundPage />;
  }

  return (
    <LayoutBase gray>
      <Switch>
        <Route path="/user/:userId/profile" component={ProfilePopup} />
        <Route path="/user/:userId/:postId" component={PostPopup} />
      </Switch>

      <div className="layout layout_profile">
        <div className="layout__header">
          {user && user.id &&
            <UserHead
              userId={user.id}
              trustedByCount={state.trustedBy.metadata.totalAmount}
              trustedByUsersIds={state.trustedBy.ids}
              trustedByPopupUsersIds={state.trustedByPopup.ids}
              trustedByPopupMetadata={state.trustedByPopup.metadata}
              trustedByOnChangePage={trustedByOnChangePage}
              iFollowCount={state.iFollow.metadata.totalAmount}
              iFollowUserIds={state.iFollow.ids}
              iFollowPopupUserIds={state.iFollowPopup.ids}
              iFollowPopupMetadata={state.iFollowPopup.metadata}
              iFollowOnChangePage={iFollowOnChangePage}
              followedByCount={state.followedBy.metadata.totalAmount}
              followedByUserIds={state.followedBy.ids}
              followedByPopupUserIds={state.followedByPopup.ids}
              followedByPopupMetadata={state.followedByPopup.metadata}
              followedByOnChangePage={followedByOnChangePage}
            />
          }
        </div>
        <div className="layout__sidebar">
          <EntryListSectionOrgsWrapper
            title="Communities"
            count={state.orgs.metadata.totalAmount}
            limit={5}
            ids={state.orgs.ids}
            popupIds={state.orgsPopup.ids}
            popupMetadata={state.orgsPopup.metadata}
            onChangePage={orgsPopupOnChangePage}
          />

          {user &&
            <EntryContacts site={user.personalWebsiteUrl} />
          }

          {user &&
            <EntrySocialNetworks urls={(user.usersSources || []).map(i => i.sourceUrl).filter(i => !!i)} />
          }

          {user &&
            <EntryCreatedAt date={user.createdAt} />
          }

          {user && !userIsOwner(user, owner) &&
            <Trust
              loading={state.trustLoading}
              trusted={user && user.myselfData && user.myselfData.trust}
              userName={getUserName(user)}
              userAvtarUrl={urls.getFileUrl(user.avatarFilename)}
              onClickTrust={() => submitTrust(true)}
              onClickUntrust={() => submitTrust(false)}
            />
          }
        </div>
        <div className="layout__main">
          {user &&
            <EntryAbout text={user.about} />
          }

          {user && user.id &&
            <Feed
              userId={user.id}
              isCurrentUser={user.id === owner.id}
              feedTypeId={USER_WALL_FEED_ID}
            />
          }
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
};

export const getUserPageData = async (store, params) => {
  const userPromise = store.dispatch(userPageActions.getPageData(params.userId));
  const postPromise = params.postId ? store.dispatch(postsFetch({ postId: params.postId })) : null;
  const feedPromise = store.dispatch(feedGetUserPosts({
    feedTypeId: USER_WALL_FEED_ID,
    page: 1,
    perPage: FEED_PER_PAGE,
    userId: params.userId,
    userIdentity: params.userId,
  }));

  try {
    const [{ user }] = await Promise.all([userPromise, postPromise, feedPromise]);

    return {
      contentMetaTags: {
        title: getUserName(user),
        description: user.about,
        image: urls.getFileUrl(user.avatarFilename),
      },
    };
  } catch (err) {
    throw err;
  }
};

export default UserPage;
