import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './index';
import { selectCommentsByContainerId, selectCommentsByIds, selectUsersByIds, selectOwner, selectPostById, selectOrgById } from '../../store/selectors';
import fromNow from '../../utils/fromNow';
import { getCommentsTree } from '../../utils/comments';
import urls from '../../utils/urls';
import { ORGANIZATION_TYPE_ID_MULTI } from '../../utils/constants';
import { getUserName } from '../../utils/user';
import { createComment, updateComment, getPostComments, getCommentsOnComment } from '../../actions/comments';
import { addErrorNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';
import Command from '../../utils/command';
import * as walletActions from '../../actions/wallet';

const Wrapper = ({ containerId, postId, ...props }) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const commentsByContainerId = useSelector(selectCommentsByContainerId(containerId, postId), isEqual);
  const comments = useSelector(selectCommentsByIds(commentsByContainerId && commentsByContainerId.commentIds), isEqual);
  const users = useSelector(selectUsersByIds(comments && comments.map(c => c.user)), isEqual);
  const post = useSelector(selectPostById(postId), isEqual);
  const orgId = post.organizationId;
  const org = useSelector(selectOrgById(orgId), isEqual);
  let disabledForNonMultiOrg;

  if (orgId) {
    disabledForNonMultiOrg = org ? org.organizationTypeId !== ORGANIZATION_TYPE_ID_MULTI : true;
  } else {
    disabledForNonMultiOrg = false;
  }

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

  const sendTokensIfNeeded = async (description) => {
    if (Command.stringHasTipCommand(description)) {
      const { accountName, amount } = Command.parseTipCommand(description);
      await dispatch(walletActions.sendTokens.send(accountName, amount, `@tip @${accountName} ${amount} uos ${urls.getDirectUrl(urls.getPostUrl(post))}`));
    }
  };

  const onSubmit = useCallback(
    async (postId, parentCommentId, containerId, data) => {
      await sendTokensIfNeeded(data.description);

      try {
        await withLoader(dispatch(createComment(postId, parentCommentId, containerId, data)));
      } catch (err) {
        dispatch(addErrorNotificationFromResponse(err));
        throw err;
      }
    },
    [dispatch],
  );

  const onUpdate = useCallback(
    async (commentId, data) => {
      await sendTokensIfNeeded(data.description);

      try {
        await withLoader(dispatch(updateComment(commentId, data)));
      } catch (err) {
        dispatch(addErrorNotificationFromResponse(err));
        throw err;
      }
    },
    [dispatch],
  );

  const onClickShowNext = useCallback(
    async (containerId, postId, page, perPage) => {
      try {
        await withLoader(dispatch(getPostComments(containerId, postId, page, perPage)));
      } catch (err) {
        dispatch(addErrorNotificationFromResponse(err));
      }
    },
    [dispatch],
  );

  const onClickShowReplies = useCallback(
    async (containerId, postId, parentId, parentDepth, page, perPage) => {
      try {
        await withLoader(dispatch(getCommentsOnComment(containerId, postId, parentId, parentDepth, page, perPage)));
      } catch (err) {
        dispatch(addErrorNotificationFromResponse(err));
      }
    },
    [dispatch],
  );

  const onError = useCallback(
    message => dispatch(addErrorNotification(message)),
    [dispatch],
  );

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
      disabledForNonMultiOrg={disabledForNonMultiOrg}
    />
  );
};

Wrapper.propTypes = {
  containerId: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
};

export default Wrapper;
