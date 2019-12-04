import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import React from 'react';
import LayoutBase from '../components/Layout/LayoutBase';
import Footer from '../components/Footer';
import urls from '../utils/urls';
import * as overviewUtils from '../utils/overview';
import Publications from '../components/Overview/PublicationsTab';
import Posts from '../components/Overview/PostsTab';
import Communities from '../components/Overview/CommunitiesTab';
import Tags from '../components/Overview/TagsTab';
import NotFoundPage from './NotFoundPage';
import * as feedActions from '../actions/feed';
import { communityFeedGet } from '../actions/communityFeed';
import { tagsFeedGet } from '../actions/tagsFeed';
import { FEED_PER_PAGE, POST_TYPE_MEDIA_ID, POST_TYPE_DIRECT_ID } from '../utils';
import Tabs from '../components/Tabs';

const Overview = (props) => {
  const { t } = useTranslation();
  const overviewCategoryName = props.match.params.filter;
  const overviewRouteName = props.match.params.route;
  const overviewCategory = overviewUtils.OVERVIEW_CATEGORIES.find(i => i.name === overviewCategoryName);

  if (!overviewCategory || !overviewRouteName) {
    return <NotFoundPage />;
  }

  const overviewComponents = {
    publications: Publications,
    posts: Posts,
    communities: Communities,
    tags: Tags,
  };

  const overviewRoutes = overviewUtils.OVERVIEW_ROUTES.map(item => ({
    path: `/overview/${item.name}/filter/:filter`,
    component: overviewComponents[item.name],
  }));

  return (
    <LayoutBase>
      <div className="content-wrapper content_overview">
        <div className="content">
          <div className="content__inner content__inner_overview">
            <div className="nav-bar">
              <div className="nav-bar__title nav-bar__title_overview">
                <h1 className="title title_bold">{t('Overview')}</h1>

                <Tabs
                  responsive
                  capitalize
                  theme="thinBlack"
                  items={overviewUtils.OVERVIEW_CATEGORIES.filter(i => ['fresh', 'top'].includes(i.name)).map(item => ({
                    title: item.name,
                    url: urls.getOverviewCategoryUrl({ filter: item.name, route: overviewRouteName }),
                    active: props.location.pathname.indexOf(`filter/${item.name}`) !== -1,
                  }))}
                />
              </div>
            </div>
          </div>
          <div className="content__inner content__inner_overview content__inner_overview_shadow">
            <Tabs
              responsive
              withIndent
              capitalize
              items={overviewUtils.OVERVIEW_ROUTES.map(item => ({
                title: item.name,
                url: urls.getOverviewCategoryUrl({ route: item.name, filter: overviewCategoryName }),
                active: props.location.pathname.indexOf(urls.getOverviewCategoryUrl({ route: item.name, filter: overviewCategoryName })) === 0,
              }))}
            />
            <Switch>
              {overviewRoutes.map(r => <Route path={r.path} component={r.component} key={r.path} />)}
            </Switch>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="content__inner">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

Overview.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      filter: PropTypes.string,
      route: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export const getPageData = (store, {
  page = 1, route, filter,
}) => {
  const { feedGetPosts } = feedActions;
  const overviewCategory = overviewUtils.OVERVIEW_CATEGORIES.find(i => i.name === filter);
  if (!overviewCategory) return null;
  const overviewCategoryId = overviewCategory.id;
  let feedGet;
  let data;
  if ((route === 'publications') || (route === 'posts')) {
    feedGet = feedGetPosts;
    const postTypeId = route === 'publications' ? POST_TYPE_MEDIA_ID : POST_TYPE_DIRECT_ID;
    data = {
      postTypeId, page, perPage: FEED_PER_PAGE, categoryId: overviewCategoryId,
    };
  } else if ((route === 'communities') || (route === 'tags')) {
    feedGet = route === 'publications' ? communityFeedGet : tagsFeedGet;
    data = {
      page, perPage: FEED_PER_PAGE, categoryId: overviewCategoryId,
    };
  }
  return store.dispatch(feedGet(data));
};

export default Overview;
