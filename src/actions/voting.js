import Wallet from 'ucom-libs-wallet';
import api, { graphql } from '../api';
import { addUsers } from './users';
import { postsFetch } from './posts';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../utils/constants';

const { ContentInteractionsApi } = Wallet.Content;

export const getVotesForEntityPreview = (entityId, entityName) => async (dispatch) => {
  const { upvotes, downvotes } = await graphql.getVotesForEntityPreview(entityId, entityName);

  dispatch(addUsers(upvotes.data.concat(downvotes.data)));

  return { upvotes, downvotes };
};

export const getVotesForEntity = (entityId, entityName, interactionType, page, perPage) => async (dispatch) => {
  const { data, metadata } = await graphql.getVotesForEntity(entityId, entityName, interactionType, page, perPage);

  dispatch(addUsers(data));

  return { data, metadata };
};

export const voteForPost = (isUp, postId, accountName, privateKey, blockchainId) => async (dispatch) => {
  const signTransaction = isUp ? ContentInteractionsApi.getUpvoteContentSignedTransaction : ContentInteractionsApi.getDownvoteContentSignedTransaction;
  const signedTransactionObject = await signTransaction(accountName, privateKey, blockchainId);
  const signedTransaction = JSON.stringify(signedTransactionObject);

  await api.vote(isUp, postId, null, signedTransaction);
  await dispatch(postsFetch({ postId }));
};

export const voteForComment = (isUp, postId, commentId, accountName, privateKey, blockchainId) => async (dispatch) => {
  const signTransaction = isUp ? ContentInteractionsApi.getUpvoteContentSignedTransaction : ContentInteractionsApi.getDownvoteContentSignedTransaction;
  const signedTransactionObject = await signTransaction(accountName, privateKey, blockchainId);
  const signedTransaction = JSON.stringify(signedTransactionObject);
  const data = await api.vote(isUp, postId, commentId, signedTransaction);

  dispatch({
    type: 'SET_COMMENT_VOTE',
    payload: {
      id: commentId,
      currentVote: data.currentVote,
      myselfVote: isUp ? UPVOTE_STATUS : DOWNVOTE_STATUS,
    },
  });
};
