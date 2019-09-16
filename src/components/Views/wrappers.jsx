import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectPostById } from '../../store/selectors';
import equalByProps from '../../utils/equalByProps';
import Views from './index';

export const PostView = ({ postId }) => {
  const post = useSelector(selectPostById(postId), equalByProps(['viewsCount']));

  return <Views count={post.viewsCount} />;
};

PostView.propTypes = {
  postId: PropTypes.number.isRequired,
};
