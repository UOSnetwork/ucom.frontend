import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Autoupdate, { Trust } from './index';
import { selectPostById } from '../../../store';
import {
  EVENT_ID_USER_TRUSTS_YOU,
  EVENT_ID_USER_UNTRUSTS_YOU,
  getUserName,
  urls,
  getAutoupdateEventId,
  getAutoupdateTargetEntity,
  getAutoupdateData,
  getAutoupdateLabelByEventId,
} from '../../../utils';

export const PostAutoupdate = ({ postId, ...props }) => {
  const post = useSelector(selectPostById(postId), isEqual);
  const eventId = getAutoupdateEventId(post);
  const targetEntity = getAutoupdateTargetEntity(post);
  const data = getAutoupdateData(post);

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
      url={urls.getFeedPostUrl(post)}
      commentsCount={post.commentsCount}
      label={getAutoupdateLabelByEventId(eventId)}
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
