import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styles from './styles.css';
import Comment from './Comment';
import Form from './Form';
import ShowNext from './ShowNext';
import { COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST } from '../../utils/comments';

const Comments = (props) => {
  const newComment = props.comments.filter(i => i.isNew);
  const comments = props.comments.filter(i => newComment.every(j => j.id !== i.id));

  return (
    <div className={styles.comments}>
      <div className={styles.list}>
        {comments.map(comment => (
          <Comment
            {...{ ...comment, ...props }}
            key={comment.id}
          />
        ))}

        {props.metadata[0] && props.metadata[0].hasMore &&
          <ShowNext
            containerId={props.containerId}
            postId={props.postId}
            perPage={props.metadata[0].perPage}
            page={props.metadata[0].page}
            onClick={props.onClickShowNext}
          />
        }

        {newComment.map(comment => (
          <Comment
            {...{ ...comment, ...props }}
            key={comment.id}
          />
        ))}
      </div>

      <Form
        flat
        {...{ ...props }}
        userImageUrl={props.ownerImageUrl}
        userPageUrl={props.ownerPageUrl}
        userName={props.ownerName}
      />
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.number.isRequired,
  containerId: PropTypes.oneOf([COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST]).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    userAccountName: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    isNew: PropTypes.bool.isRequired,
  })),
  metadata: PropTypes.objectOf(PropTypes.shape({
    hasMore: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
  })),
  ownerId: PropTypes.number,
  ownerImageUrl: PropTypes.string,
  ownerPageUrl: PropTypes.string,
  ownerName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClickShowNext: PropTypes.func.isRequired,
  onClickShowReplies: PropTypes.func.isRequired,
};

Comments.defaultProps = {
  comments: [],
  metadata: {},
  ownerId: null,
  ownerImageUrl: null,
  ownerPageUrl: null,
  ownerName: null,
};

export default memo(Comments, (prev, next) => (
  isEqual(prev.comments, next.comments) &&
  isEqual(prev.metadata, next.metadata)
));
