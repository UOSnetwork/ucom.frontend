import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Rating from './Rating';
import { postVote } from '../../actions/posts';
import { selectPostById, selectOwner } from '../../store/selectors';

const PostRating = (props) => {
  const dispatch = useDispatch();
  const post = useSelector(selectPostById(props.postId));
  const owner = useSelector(selectOwner);

  if (!post) {
    return null;
  }

  return (
    <Rating
      disabled={post.userId === owner.id}
      currentVote={post.currentVote}
      myselfVote={post.myselfData && post.myselfData.myselfVote}
      onClickVoteDown={() => dispatch(postVote({ postId: props.postId, isUp: false }))}
      onClickVoteUp={() => dispatch(postVote({ postId: props.postId, isUp: true }))}
    />
  );
};

PostRating.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default PostRating;
