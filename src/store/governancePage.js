import merge from '../utils/merge';
import {
  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
} from '../utils/constants';

const getInitialVotingNodesState = () => ({
  ids: [],
  metadata: {
    orderBy: 'bp_status',
  },
});

const getInitialState = () => ({
  activeSectionId: null,
  nodes: {
    [BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS]: {
      ids: [],
      metadata: {
        orderBy: 'bp_status',
      },
    },
    [BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES]: {
      ids: [],
      metadata: {
        orderBy: 'bp_status',
      },
    },
  },
  selectedNodesIds: [],
  votingNodes: getInitialVotingNodesState(),
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'GOVERNANCE_PAGE_RESET':
      return getInitialState();

    case 'GOVERNANCE_PAGE_RESET_VOTING_NODES':
      return merge({}, state, {
        votingNodes: getInitialVotingNodesState(),
      });

    case 'GOVERNANCE_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
