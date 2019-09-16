import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Tags from './index';
import { selectPostById } from '../../store/selectors';
import equalByProps from '../../utils/equalByProps';
import { searchTags } from '../../utils/text';
import urls from '../../utils/urls';

export const PostTags = ({ postId }) => {
  const post = useSelector(selectPostById(postId), equalByProps(['description']));

  if (!post) {
    return null;
  }

  const tags = searchTags(post.description).map(tag => ({
    title: tag,
    url: urls.getTagUrl(tag),
  }));

  return <Tags tags={tags} />;
};

PostTags.propTypes = {
  postId: PropTypes.number.isRequired,
};
