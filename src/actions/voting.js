import graphql from '../api/graphql';
import { addUsers } from './users';

export const getVotesForPostPreview = postId => async (dispatch) => {
  try {
    const { upvotes, downvotes } = await graphql.getVotesForPostPreview(postId);

    dispatch(addUsers(upvotes.data.concat(downvotes.data)));

    return { upvotes, downvotes };
  } catch (err) {
    throw err;
  }
};

export const getVotesForPost = (
  postId,
  interactionType,
  page,
  perPage,
) => async (dispatch) => {
  try {
    const { data, metadata } = await graphql.getVotesForPost(
      postId,
      interactionType,
      page,
      perPage,
    );

    dispatch(addUsers(data));

    return { data, metadata };
  } catch (err) {
    throw err;
  }
};
