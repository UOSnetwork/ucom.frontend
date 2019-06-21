import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Post from './Post';

const PostsGrid = ({ posts }) => (
  <div className={styles.container}>
    <div className={styles.postsGrid}>
      {posts.filter(post => Boolean(post.title)).slice(0, 5).map((post, index) => (
        <Post
          key={post.id}
          post={post}
          index={index}
        />
      ))}
    </div>
  </div>
);

PostsGrid.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

PostsGrid.defaultProps = {
  posts: [],
};

export * from './wrappers';
export default PostsGrid;
