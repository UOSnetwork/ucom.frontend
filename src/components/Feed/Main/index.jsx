import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Tabs from './Tabs';
import FeedView from '../FeedView';
import graphql from '../../../api/graphql';
import { MAIN_FEED_ID } from '../../../utils/feed';
import { parsePosts } from '../../../actions/feed';
import { addErrorNotification } from '../../../actions/notifications';
import withLoader from '../../../utils/withLoader';

const FeedMain = ({ dispatch }) => {
  const [activeTabId, setActiveTabId] = useState();
  const [feedPostsIds, setFeedPostsIds] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedHasMore, setFeedHasMore] = useState(false);
  const [feedPage, setFeedPage] = useState(1);

  const getPosts = async ({
    page = 1,
  }) => {
    setFeedLoading(true);

    try {
      const data = await withLoader(graphql.getPosts({ page }));
      const { manyPosts } = data;
      setFeedPostsIds(feedPostsIds.concat(manyPosts.data.map(post => post.id)));
      setFeedHasMore(manyPosts.metadata.hasMore);
      setFeedPage(page);
      dispatch(parsePosts(manyPosts.data));
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }

    setFeedLoading(false);
  };

  const onClickLoadMore = () => {
    getPosts({ page: feedPage + 1 });
  };

  useEffect(() => {
    getPosts({ page: feedPage });
  }, []);

  return (
    <div className="grid grid_content">
      <div className="grid__item grid__item_main">
        <Tabs
          activeTabId={activeTabId}
          onClickItem={setActiveTabId}
        />
        <FeedView
          feedTypeId={MAIN_FEED_ID}
          postIds={feedPostsIds}
          loading={feedLoading}
          hasMore={feedHasMore}
          onClickLoadMore={onClickLoadMore}
        />
      </div>
      <div className="grid__item grid__item_side" />
    </div>
  );
};

FeedMain.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect(state => ({
  feed: state.feed,
}))(FeedMain);
