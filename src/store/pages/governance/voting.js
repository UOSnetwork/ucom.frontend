import merge from '../../../utils/merge';

const getInitialState = () => ({
  nodesToVoteIds: [],
  nodesToUnVoteIds: [],
  ids: [],
  metadata: {
    orderBy: 'bp_status',
  },
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'GOVERNANCE_PAGE_VOTING_RESET':
      return getInitialState();

    case 'GOVERNANCE_PAGE_VOTING_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};
