import { without } from 'lodash';
import { graphql } from '../../../api';
import * as nodesActions from '../../nodes';
import {
  NODES_PER_PAGE,
  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
} from '../../../utils/constants';
import Worker from '../../../worker';

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

export const setSelectedNodes = (nodesIds, nodeTypeId) => (dispatch) => {
  dispatch(setData({
    selectedIds: {
      [nodeTypeId]: nodesIds,
    },
  }));
};

export const voteForNodes = (accountName, nodes, privateKey, nodeTypeId) => async () => {
  try {
    const producers = nodes
      .map(i => i.title)
      .filter(i => i !== 'eosiomeetone');

    const voteFunctions = {
      [BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS]: Worker.voteForBlockProducers,
      [BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES]: Worker.voteForCalculatorNodes,
    };

    await voteFunctions[nodeTypeId](accountName, privateKey, producers);
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
