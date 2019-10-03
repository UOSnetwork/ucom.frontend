import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import PublicationCard from './index';
import { selectPostById, selectUserById } from '../../../store';
import { urls } from '../../../utils';
import { getPostCoverUrl } from '../../../utils/posts';
import { getUserName } from '../../../utils/user';
import { formatRate } from '../../../utils/rate';
import equalByProps from '../../../utils/equalByProps';

export const PublicationCardWrapper = ({ postId }) => {
  const post = useSelector(selectPostById(postId), equalByProps(['userId', 'title', 'currentRate', 'id', 'entityImages']));

  if (!post) {
    return null;
  }

  const user = useSelector(selectUserById(post.userId), equalByProps(['id', 'avatarFilename', 'firstName', 'accountName']));

  if (!user) {
    return null;
  }

  return (
    <PublicationCard
      coverSrc={getPostCoverUrl(post)}
      coverAlt={post.title}
      rating={formatRate(post.currentRate, true)}
      title={post.title}
      userAvatarSrc={urls.getFileUrl(user.avatarFilename)}
      userName={getUserName(user)}
      userUrl={urls.getUserUrl(user.id)}
      postUrl={urls.getPublicationUrl(post.id)}
    />
  );
};

PublicationCardWrapper.propTypes = {
  postId: PropTypes.number.isRequired,
};
