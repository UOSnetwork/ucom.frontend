import PropTyeps from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectPostsByIds } from '../../store/selectors';
import PostsGrid from './index';

export const PostsGridWrapper = (props) => {
  const posts = useSelector(selectPostsByIds(props.ids));

  return (
    <PostsGrid posts={posts} />
  );
};

PostsGridWrapper.propTypes = {
  ids: PropTyeps.arrayOf(PropTyeps.number),
};

PostsGridWrapper.defaultProps = {
  ids: [],
};
