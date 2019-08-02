import { without } from 'lodash';
import api, { graphql } from '../../../api';
import * as nodesActions from '../../nodes';
import {
  NODES_PER_PAGE,
  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
  BP_STATUS_BACKUP_ID,
  BP_STATUS_ACTIVE_ID,
} from '../../../utils/constants';

export const reset = () => ({ type: 'GOVERNANCE_PAGE_RESET' });

export const setData = payload => ({ type: 'GOVERNANCE_PAGE_SET_DATA', payload });

export const votingReset = () => ({ type: 'GOVERNANCE_PAGE_VOTING_RESET' });

export const votingSetData = payload => ({ type: 'GOVERNANCE_PAGE_VOTING_SET_DATA', payload });

export const toggleSection = (currentSectionId, sectionId) => (dispatch) => {
  dispatch(setData({
    activeSectionId: currentSectionId === sectionId ? null : sectionId,
  }));
};

export const getNodes = (
  nodeType,
  page,
  orderBy,
) => async (dispatch) => {
  try {
    const data = await graphql.getNodes({
      filters: {
        myself_votes_only: false,
        blockchain_nodes_type: nodeType,
      },
      page,
      per_page: NODES_PER_PAGE,
      order_by: orderBy,
    });

    dispatch(nodesActions.add(data.data));

    dispatch(setData({
      nodes: {
        [nodeType]: {
          ids: data.data.map(i => i.id),
          metadata: {
            ...data.metadata,
            orderBy,
          },
        },
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSelectedNodes = userId => async (dispatch) => {
  try {
    const { blockProducers, calculatorsNodes } = await graphql.getSelectedNodes(userId);

    dispatch(nodesActions.add(blockProducers.data.concat(calculatorsNodes.data)));

    dispatch(setData({
      selectedIds: {
        [BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS]: blockProducers.data.map(i => i.id),
        [BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES]: calculatorsNodes.data.map(i => i.id),
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const voteForNodes = (accountName, nodes, privateKey, nodeTypeId) => async (dispatch) => {
  try {
    const producers = nodes
      // .filter(node => node.bpStatus === BP_STATUS_ACTIVE_ID || node.bpStatus === BP_STATUS_BACKUP_ID)
      .map(i => i.title)
      .filter(i => i !== 'eosiomeetone');

    await api.voteForNodes(accountName, producers, privateKey, nodeTypeId);

    dispatch(setData({
      selectedIds: {
        [nodeTypeId]: nodes.map(i => i.id),
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const votingGetNodes = (
  nodeType,
  page,
  orderBy,
) => async (dispatch) => {
  try {
    const data = await graphql.getNodes({
      filters: {
        myself_votes_only: false,
        blockchain_nodes_type: nodeType,
      },
      page,
      per_page: NODES_PER_PAGE,
      order_by: orderBy,
    });

    dispatch(nodesActions.add(data.data));

    dispatch(votingSetData({
      ids: data.data.map(i => i.id),
      metadata: {
        ...data.metadata,
        orderBy,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const votingSetNodesToVote = nodesIds => (dispatch) => {
  dispatch(votingSetData({
    nodesToVoteIds: nodesIds,
  }));
};

export const votingToggleNode = nodeId => (dispatch, getState) => {
  const state = getState();

  dispatch(votingSetData(state.pages.governance.voting.nodesToVoteIds.includes(nodeId) ? {
    nodesToVoteIds: without(state.pages.governance.voting.nodesToVoteIds, nodeId),
    nodesToUnVoteIds: state.pages.governance.voting.nodesToUnVoteIds.concat(nodeId),
  } : {
    nodesToVoteIds: state.pages.governance.voting.nodesToVoteIds.concat(nodeId),
    nodesToUnVoteIds: without(state.pages.governance.voting.nodesToUnVoteIds, nodeId),
  }));
};
