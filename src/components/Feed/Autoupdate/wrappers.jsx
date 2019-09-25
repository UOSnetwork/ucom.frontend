import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Autoupdate, { Trust } from './index';
import { selectPostById } from '../../../store';
import { EVENT_ID_USER_TRUSTS_YOU, EVENT_ID_USER_UNTRUSTS_YOU, getUserName, urls } from '../../../utils';

const getEventId = post => (post && post.jsonData && post.jsonData.metaData && post.jsonData.metaData.eventId) || null;
const getTargetEntity = post => (post && post.jsonData && post.jsonData.targetEntity) || null;
const getData = post => (post && post.jsonData && post.jsonData.data) || null;
const getLabelByEventId = (eventId) => {
  switch (eventId) {
    case EVENT_ID_USER_TRUSTS_YOU:
      return 'Trust';
    case EVENT_ID_USER_UNTRUSTS_YOU:
      return 'Untrust';
    default:
      return null;
  }
};

export const PostAutoupdate = ({ postId, ...props }) => {
  const post = useSelector(selectPostById(postId), isEqual);
  const eventId = getEventId(post);
  const targetEntity = getTargetEntity(post);
  const data = getData(post);

  if (!post || !eventId || !targetEntity || !data || !data.user) {
    return null;
  }

  const content = (() => {
    switch (eventId) {
      case EVENT_ID_USER_TRUSTS_YOU:
      case EVENT_ID_USER_UNTRUSTS_YOU:
        return (
          <Trust
            isTrusted={eventId === EVENT_ID_USER_TRUSTS_YOU}
            userName={getUserName(targetEntity.user)}
            avatarSrc={urls.getFileUrl(targetEntity.user.avatarFilename)}
            userUrl={urls.getUserUrl(targetEntity.user.id)}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <Autoupdate
      {...props}
      postId={postId}
      commentsCount={post.commentsCount}
      label={getLabelByEventId(eventId)}
      content={content}
      userName={getUserName(data.user)}
      userUrl={urls.getUserUrl(data.user.id)}
      userAvatarSrc={urls.getFileUrl(data.user.avatarFilename)}
      createdAt={post.createdAt}
    />
  );
};

PostAutoupdate.propTypes = {
  postId: PropTypes.number.isRequired,
};
