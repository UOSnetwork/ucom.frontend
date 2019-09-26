import { isEqual } from 'lodash';
import classNames from 'classnames';
import { Route, Switch } from 'react-router';
import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserHead from '../../components/User/UserHead/index';
import LayoutBase from '../../components/Layout/LayoutBase';
import { postsFetch } from '../../actions/posts';
import urls from '../../utils/urls';
import { validUrl } from '../../utils/url';
import FeedUser from '../../components/Feed/FeedUser';
import { FEED_TYPE_ID_USER_WALL, FEED_PER_PAGE, POST_TYPE_MEDIA_ID, POST_TYPE_AUTOUPDATE_ID } from '../../utils';
import { feedGetUserPosts } from '../../actions/feed';
import NotFoundPage from '../NotFoundPage';
import Footer from '../../components/Footer';
import EntrySocialNetworks from '../../components/EntrySocialNetworks';
import EntryCreatedAt from '../../components/EntryCreatedAt';
import EntryContacts from '../../components/EntryContacts';
import EntryAbout from '../../components/EntryAbout';
import { EntryListSectionOrgsWrapper } from '../../components/EntryListSection';
import { UserTrust } from '../../components/Trust';
import { userIsOwner } from '../../utils/user';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import PostPopup from './Post';
import ProfilePopup from './Profile';
import withLoader from '../../utils/withLoader';
import Cover from '../../components/Cover';
import * as userPageActions from '../../actions/userPage';
import { selectUserById, selectOwner } from '../../store/selectors';
import { getPublicationMetaTags, getAutoupdateMetatagsForUserPage, getPostPopupMetatagsForUserPage, getMetatagsForUserPage } from '../../utils/posts';
import * as EntityImages from '../../utils/entityImages';

const UserPage = (props) => {
  const userIdentity = props.match.params.userId;
  const state = useSelector(state => state.userPage, isEqual);
  const user = useSelector(selectUserById(state.userIdentity), isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const dispatch = useDispatch();

  const getPageData = async () => {
    try {
      dispatch(userPageActions.reset());
      await withLoader(dispatch(userPageActions.getPageData(userIdentity)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const trustedByOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getTrustedByPopup(userIdentity, page)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const iFollowOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getIFollowPopup(userIdentity, page)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const followedByOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getFollowedByPopup(userIdentity, page)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const orgsPopupOnChangePage = async (page) => {
    try {
      await withLoader(dispatch(userPageActions.getOrgsPopup(userIdentity, page)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getPageData();

    return () => {
      dispatch(userPageActions.reset());
    };
  }, [userIdentity]);

  if (state.loaded && !user) {
    return <NotFoundPage />;
  }

  return (
    <LayoutBase gray>
      <Switch>
        <Route path={urls.getUserEditProfileUrl(':userId')} component={ProfilePopup} />
        <Route path={urls.getPostUrl({ id: ':postId', entityIdFor: ':userId' })} component={PostPopup} />
      </Switch>

      {user && EntityImages.entityHasCover(user.entityImages) &&
        <Cover src={EntityImages.entityGetCoverUrl(user.entityImages)} />
      }

      {/* TODO: Refactoring Layout/Content when governance refactoring is done */}
      <div
        className={classNames({
          'layout': true,
          'layout_profile': true,
          'layout_cover': user && EntityImages.entityHasCover(user.entityImages),
        })}
      >
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
            <EntrySocialNetworks urls={(user.usersSources || []).map(i => i.sourceUrl).filter(validUrl)} />
          }

          {user &&
            <EntryCreatedAt date={user.createdAt} />
          }

          {user && !userIsOwner(user, owner) &&
            <UserTrust userId={user.id} onSuccess={() => dispatch(userPageActions.getTrustedBy(user.id))} />
          }
        </div>
        <div className="layout__main">
          {user &&
            <EntryAbout text={user.about} />
          }

          {user && user.id &&
            <FeedUser
              userId={user.id}
              feedTypeId={FEED_TYPE_ID_USER_WALL}
              originEnabled={false}
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

export default memo(UserPage, isEqual);

export const getUserPageData = async (store, params) => {
  const userPromise = store.dispatch(userPageActions.getPageData(params.userId));
  const postPromise = params.postId ? store.dispatch(postsFetch({ postId: params.postId })) : null;
  const feedPromise = store.dispatch(feedGetUserPosts({
    feedTypeId: FEED_TYPE_ID_USER_WALL,
    page: 1,
    perPage: FEED_PER_PAGE,
    userId: params.userId,
    userIdentity: params.userId,
  }));

  try {
    const [{ user }, post] = await Promise.all([userPromise, postPromise, feedPromise]);

    if (!post) {
      return {
        contentMetaTags: getMetatagsForUserPage(user),
      };
    }

    switch (post.postTypeId) {
      case POST_TYPE_MEDIA_ID:
        return {
          contentMetaTags: getPublicationMetaTags(post),
        };
      case POST_TYPE_AUTOUPDATE_ID:
        return {
          contentMetaTags: getAutoupdateMetatagsForUserPage(post, user),
        };
      default:
        return {
          contentMetaTags: getPostPopupMetatagsForUserPage(post, user),
        };
    }
  } catch (err) {
    throw err;
  }
};
