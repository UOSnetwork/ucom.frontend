import { memoize } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import Comments from './index';
import { getCommentById, getCommentsByContainer } from '../../store/comments';
import { getUserById } from '../../store/users';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { getCommentsTree } from '../../utils/comments';
import { createComment, getPostComments, getCommentsOnComment } from '../../actions/comments';
import { addErrorNotification } from '../../actions/notifications';

export default connect(
  memoize((state, props) => {
    const commentsData = getCommentsByContainer(state, props.containerId, props.postId);
    let comments = [];
    let metadata = {};

    if (commentsData) {
      comments = getCommentsTree(commentsData.commentIds
        .map(id => getCommentById(state.comments, id))
        .map(comment => ({
          ...comment,
          text: comment.description,
          date: moment(comment.createdAt).fromNow(),
          userAccountName: getUserById(state.users, comment.user).accountName,
          nextDepthTotalAmount: comment.metadata.nextDepthTotalAmount,
          parentId: comment.parentId || 0,
          images: (comment && comment.entityImages) ? comment.entityImages.gallery : [],
        })));

      ({ metadata } = commentsData);
    }

    return ({
      ...props,
      metadata,
      comments,
      ownerId: state.user.data.id,
      ownerImageUrl: urls.getFileUrl(state.user.data.avatarFilename),
      ownerPageUrl: urls.getUserUrl(state.user.data.id),
      ownerName: getUserName(state.user.data),
    });
  }, (state, props) => {
    const commentsData = getCommentsByContainer(state, props.containerId, props.postId);
    return `${props.containerId}.${props.postId}.${JSON.stringify(commentsData)}`;
  }),

  dispatch => ({
    onSubmit: ({
      message,
      postId,
      commentId,
      containerId,
      entityImages,
    }) => {
      dispatch(createComment({
        containerId,
        postId,
        commentId,
        data: {
          description: message,
          entity_images: entityImages,
        },
      }));
    },

    onClickShowNext: ({
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
    },

    onClickShowReplies: ({
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
    },
    addErrorNotification: (e) => {
      dispatch(addErrorNotification(e));
    },
  }),
)(Comments);
