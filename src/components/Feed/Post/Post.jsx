import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import Direct from './Direct';
import Repost from './Repost';
import Media from './Media';
import { POST_TYPE_REPOST_ID, POST_TYPE_MEDIA_ID } from '../../../utils/posts';
import { getPostById } from '../../../store/posts';

const Post = (props) => {
  const [sharePopup, setSharePopup] = useState(false);
  const post = getPostById(props.posts, props.id);
  const toggleShare = () => setSharePopup(!sharePopup);

  if (!post) {
    return null;
  }

  switch (post.postTypeId) {
    case POST_TYPE_REPOST_ID:
      return (
        <Repost
          id={props.id}
          sharePopup={sharePopup}
          toggleShare={toggleShare}
          feedTypeId={props.feedTypeId}
        />
      );
    case POST_TYPE_MEDIA_ID:
      return (
        <Media
          id={props.id}
          sharePopup={sharePopup}
          toggleShare={toggleShare}
          feedTypeId={props.feedTypeId}
        />
      );
    default:
      return (
        <Direct
          id={props.id}
          sharePopup={sharePopup}
          toggleShare={toggleShare}
          feedTypeId={props.feedTypeId}
        />
      );
  }
};

Post.propTypes = {
  posts: PropTypes.objectOf(PropTypes.any).isRequired,
  id: PropTypes.number.isRequired,
};

export default connect(state => ({
  posts: state.posts,
}))(Post);
