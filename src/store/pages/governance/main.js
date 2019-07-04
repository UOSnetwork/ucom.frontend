import merge from '../../../utils/merge';
import {
  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
} from '../../../utils/constants';

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
  selectedIds: {
    [BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS]: [],
    [BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES]: [],
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'GOVERNANCE_PAGE_RESET':
      return getInitialState();

    case 'GOVERNANCE_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
