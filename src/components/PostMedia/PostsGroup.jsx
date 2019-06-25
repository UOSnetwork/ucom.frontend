import PropTypes from 'prop-types';
import React from 'react';
import PostCard from './PostCard';
import PostItem from '../PostItem';
import { getPostTypeById, getPostCover } from '../../utils/posts';
import { getUserName } from '../../utils/user';
import urls from '../../utils/urls';

// TODO: Remove this and deps
const PostsGroup = (props) => {
  if (!props.posts || !props.posts.length) {
    return null;
  }

  const posts = props.posts.filter(i => i.title);
  const mainPost = posts[0];
  posts.splice(0, 1);
  const sidePosts = posts.slice(0, 4);
  const footerPosts = posts.slice(4, 7);

  if (!mainPost || !mainPost.user) {
    return null;
  }

  return (
    <div className="post-group">
      <div className="post-group__item">
        <div className="grid grid_main-post">
          <div className="grid__item">
            <PostCard
              coverUrl={getPostCover(mainPost)}
              rate={mainPost.currentRate}
              title={mainPost.title}
              url={urls.getPostUrl(mainPost)}
              userUrl={urls.getUserUrl(mainPost.user.id)}
              userImageUrl={urls.getFileUrl(mainPost.user.avatarFilename)}
              userName={getUserName(mainPost.user)}
              accountName={mainPost.user.accountName}
              tags={[getPostTypeById(mainPost.postTypeId)]}
              commentsCount={mainPost.commentsCount}
            />
          </div>

          {sidePosts.map(post => (
            <div className="grid__item" key={post.id}>
              <PostItem
                title={post.title}
                rate={post.currentRate}
                url={urls.getPostUrl(post)}
                tags={[getPostTypeById(post.postTypeId)]}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="post-group__item">
        <div className="grid">
          {footerPosts.map(post => (
            <div className="grid__item" key={post.id}>
              <PostItem
                title={post.title}
                rate={post.currentRate}
                url={urls.getPostUrl(post)}
                coverImg={getPostCover(post)}
                tags={[getPostTypeById(post.postTypeId)]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PostsGroup.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

export default PostsGroup;
