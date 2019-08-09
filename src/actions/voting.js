import graphql from '../api/graphql';
import { addUsers } from './users';

export const getVotesForEntityPreview = (entityId, entityName) => async (dispatch) => {
  try {
    const { upvotes, downvotes } = await graphql.getVotesForEntityPreview(entityId, entityName);

    dispatch(addUsers(upvotes.data.concat(downvotes.data)));

    return { upvotes, downvotes };
  } catch (err) {
    throw err;
  }
};

export const getVotesForEntity = (
  entityId,
  entityName,
  interactionType,
  page,
  perPage,
) => async (dispatch) => {
  try {
    const { data, metadata } = await graphql.getVotesForEntity(
      entityId,
      entityName,
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
