import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import Promo from '../components/Promo';
import LayoutBase from '../components/Layout/LayoutBase';
import { selectUser } from '../store/selectors';
import { fetchUser } from '../actions/users';
import EntryListSection from '../components/EntryListSection';
import { getUserById, getUsersByIds } from '../store/users';
import Feed from '../components/Feed/FeedUser';
import { USER_NEWS_FEED_ID } from '../utils/feed';
import { getMainPosts } from '../actions/mainPosts';
import urls from '../utils/urls';
import { getUserName } from '../utils/user';
import PostsGrid from '../components/PostsGrid';

const HomePage = ({ mainPosts, ...props }) => {
  useEffect(() => {
    if (props.user.id) {
      props.fetchUser(props.user.id);
    }

    props.getMainPosts();
  }, []);

  const user = getUserById(props.users, props.user.id);

  return (
    <LayoutBase>
      {mainPosts.length > 0 &&
        <PostsGrid posts={mainPosts} />
      }

      <div className="content">
        {user ? (
          <div className="content__inner">
            <div className="grid grid_content">
              <div className="grid__item grid__item_main">
                <Feed userId={user.id} feedTypeId={USER_NEWS_FEED_ID} />
              </div>

              <div className="grid__item grid__item_side">
                <div className="sidebar sidebar_main">
                  {user.iFollow &&
                    <EntryListSection
                      title="People"
                      count={user.iFollow.length}
                      data={getUsersByIds(props.users, user.iFollow).map(item => ({
                        id: item.id,
                        title: getUserName(item),
                        avatarSrc: urls.getFileUrl(item.avatarFilename),
                        url: urls.getUserUrl(item.id),
                        nickname: item.accountName,
                        currentRate: item.currentRate,
                        follow: true,
                      }))}
                    />
                  }

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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Promo />
        )}

        <div className="content__inner">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

HomePage.propTypes = {
  mainPosts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

HomePage.defaultProps = {
  mainPosts: [],
};

export const getHomePageData = store => store.dispatch(getMainPosts());

export default connect(
  state => ({
    user: selectUser(state),
    users: state.users,
    mainPosts: state.mainPosts.posts,
  }),
  {
    fetchUser,
    getMainPosts,
  },
)(HomePage);
