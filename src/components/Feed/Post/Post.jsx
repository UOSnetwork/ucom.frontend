import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, memo } from 'react';
import Direct from './Direct';
import Repost from './Repost';
import Media from './Media';
import { POST_TYPE_REPOST_ID, POST_TYPE_MEDIA_ID } from '../../../utils/posts';
import { getPostById } from '../../../store/posts';
import { getUserById } from '../../../store/users';

const Post = ({
  post, user, owner, ...props
}) => {
  const [sharePopup, setSharePopup] = useState(false);
  const toggleShare = () => setSharePopup(!sharePopup);

  if (!post || !user) {
    return null;
  }

  switch (post.postTypeId) {
    case POST_TYPE_REPOST_ID:
      return (
        <Repost
          post={post}
          user={user}
          owner={owner}
          id={props.id}
          sharePopup={sharePopup}
          toggleShare={toggleShare}
          feedTypeId={props.feedTypeId}
        />
      );
    case POST_TYPE_MEDIA_ID:
      return (
        <Media
          post={post}
          user={user}
          owner={owner}
          id={props.id}
          sharePopup={sharePopup}
          toggleShare={toggleShare}
          feedTypeId={props.feedTypeId}
        />
      );
    default:
      return (
        <Direct
          post={post}
          user={user}
          owner={owner}
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

export default connect((state, props) => {
  const post = getPostById(state.posts, props.id);

  return {
    post,
    user: post ? getUserById(state.users, post.userId) : undefined,
    owner: state.user.data,
  };
})(memo(Post, (prev, next) => (
  prev.owner.id === next.owner.id &&
  prev.post.description === next.post.description &&
  prev.sharePopup === next.sharePopup &&
  isEqual(prev.post.entityImages, next.post.entityImages)
)));
