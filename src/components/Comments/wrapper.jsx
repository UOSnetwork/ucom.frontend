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
  selectPostById,
  selectOrgById,
} from '../../store/selectors';
import fromNow from '../../utils/fromNow';
import { getCommentsTree } from '../../utils/comments';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { createComment, getPostComments, getCommentsOnComment } from '../../actions/comments';
import { addErrorNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import { getOrganization } from '../../actions/organizations';
import { authShowPopup } from '../../actions/auth';
import withLoader from '../../utils/withLoader';
import { getSocialKey } from '../../utils/keys';

const Wrapper = ({ containerId, postId, ...props }) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const commentsByContainerId = useSelector(selectCommentsByContainerId(containerId, postId), isEqual);
  const comments = useSelector(selectCommentsByIds(commentsByContainerId && commentsByContainerId.commentIds), isEqual);
  const users = useSelector(selectUsersByIds(comments && comments.map(c => c.user)), isEqual);
  const post = useSelector(selectPostById(postId), isEqual);
  const org = useSelector(selectOrgById(post && post.organizationId), isEqual);

  let commentsTree = [];
  let metadata = {};

  if (comments && comments.length) {
    commentsTree = getCommentsTree(comments.map((c) => {
      const user = users.find(u => u.id === c.user);

      return {
        ...c,
        text: c.description,
        date: fromNow(c.createdAt),
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
    message,
    postId,
    commentId,
    containerId,
    entityImages,
  }) => {
    const ownerPrivateKey = getSocialKey();

    if (!owner.id || !owner.accountName || !ownerPrivateKey) {
      dispatch(authShowPopup());
      return;
    }

    try {
      let comment;
      let orgBlockchainId;

      if (commentId) {
        comment = comments.find(c => c.id === commentId);
      }

      if (post.organizationId && org.blockchainId) {
        orgBlockchainId = org.blockchainId;
      } else if (post.organizationId && !org.blockchainId) {
        const orgData = await withLoader(dispatch(getOrganization(post.organizationId)));
        orgBlockchainId = orgData.blockchainId;
      }

      await withLoader(dispatch(createComment(
        owner.id,
        owner.accountName,
        ownerPrivateKey,
        postId,
        post.blockchainId,
        containerId,
        {
          entityImages,
          description: message,
        },
        commentId,
        comment && comment.blockchainId,
        orgBlockchainId,
      )));
    } catch (err) {
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
    />
  );
};

Wrapper.propTypes = {
  containerId: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
};

export default Wrapper;
