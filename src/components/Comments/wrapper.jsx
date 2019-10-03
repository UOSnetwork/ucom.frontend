import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './index';
import {
  selectCommentsByContainerId,
  selectCommentsByIds,
  selectUsersByIds,
  selectOwner,
} from '../../store/selectors';
import fromNow from '../../utils/fromNow';
import { getCommentsTree } from '../../utils/comments';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { createComment, updateComment, getPostComments, getCommentsOnComment } from '../../actions/comments';
import { addErrorNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';

const Wrapper = ({ containerId, postId, ...props }) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const commentsByContainerId = useSelector(selectCommentsByContainerId(containerId, postId), isEqual);
  const comments = useSelector(selectCommentsByIds(commentsByContainerId && commentsByContainerId.commentIds), isEqual);
  const users = useSelector(selectUsersByIds(comments && comments.map(c => c.user)), isEqual);

  let commentsTree = [];
  let metadata = {};

  if (comments && comments.length) {
    commentsTree = getCommentsTree(comments.map((c) => {
      const user = users.find(u => u.id === c.user);

      return {
        ...c,
        text: c.description,
        date: fromNow(c.createdAt),
        createdAt: c.createdAt,
        userAccountName: user && user.accountName,
        nextDepthTotalAmount: c.metadata.nextDepthTotalAmount,
        parentId: c.parentId || 0,
        images: (c && c.entityImages) ? c.entityImages.gallery : [],
        entityImages: (c && c.entityImages) ? c.entityImages : {},
      };
    }));

    ({ metadata } = commentsByContainerId);
  }

  const onSubmit = async ({
    postId,
    message,
    commentId,
    containerId,
    entityImages,
  }) => {
    try {
      await withLoader(dispatch(createComment(postId, commentId, containerId, {
        entityImages,
        description: message,
      })));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const onUpdate = async ({ commentId, data }) => {
    try {
      await withLoader(dispatch(updateComment(commentId, data)));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const onClickShowNext = ({
    containerId,
    postId,
    page,
    perPage,
  }) => {
    dispatch(getPostComments({
      containerId,
      postId,
      page,
      perPage,
    }));
  };

  const onClickShowReplies = ({
    containerId,
    postId,
    parentId,
    parentDepth,
    page,
    perPage,
  }) => {
    dispatch(getCommentsOnComment({
      containerId,
      commentableId: postId,
      parentId,
      parentDepth,
      page,
      perPage,
    }));
  };

  const onError = (e) => {
    dispatch(addErrorNotification(e));
  };

  return (
    <Comments
      {...props}
      containerId={containerId}
      postId={postId}
      metadata={metadata}
      comments={commentsTree}
      ownerId={owner.id}
      ownerImageUrl={urls.getFileUrl(owner.avatarFilename)}
      ownerPageUrl={urls.getUserUrl(owner.id)}
      ownerName={getUserName(owner)}
      onSubmit={onSubmit}
      onClickShowNext={onClickShowNext}
      onClickShowReplies={onClickShowReplies}
      onError={onError}
      onUpdate={onUpdate}
    />
  );
};

Wrapper.propTypes = {
  containerId: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
};

export default Wrapper;
