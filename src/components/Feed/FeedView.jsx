import PropTypes from 'prop-types';
import React from 'react';
import FeedInput from './FeedInput';
import Post from './Post/Post';
import LoadMore from './LoadMore';

const Feed = props => (
  <div className={`feed ${props.isMobile ? 'feed-mobile' : ''}`}>
    {props.onSubmitPostForm &&
      <FeedInput
        onSubmit={props.onSubmitPostForm}
        initialText={props.feedInputInitialText}
      />
    }

    {props.postIds.length > 0 &&
      <div className="feed__list">
        {(props.filter ? props.postIds.filter(props.filter) : props.postIds).map(id => (
          <div className="feed__item" key={id}>
            <Post id={id} feedTypeId={props.feedTypeId} />
          </div>
        ))}
      </div>
    }

    {props.hasMore &&
      <div className="feed__loadmore">
        <LoadMore
          url={props.loadMoreUrl}
          disabled={props.loading}
          onClick={() => {
            if (props.loading) return;
            props.onClickLoadMore();
          }}
        />
      </div>
    }
  </div>
);

Feed.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  postIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool.isRequired,
  loadMoreUrl: PropTypes.string,
  feedInputInitialText: PropTypes.string,
  onSubmitPostForm: PropTypes.func,
  onClickLoadMore: PropTypes.func.isRequired,
  filter: PropTypes.func,
  isMobile: PropTypes.bool,
};

Feed.defaultProps = {
  loadMoreUrl: null,
  onSubmitPostForm: null,
  feedInputInitialText: null,
  filter: null,
  isMobile: false,
};

export default Feed;
