import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import withLoader from '../../../utils/withLoader';
import Election from './Election';
import Cast from './Cast';
import * as governancePageActions from '../../../actions/pages/governance';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import { BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS, BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES } from '../../../utils/constants';
import urls from '../../../utils/urls';

const Voting = ({ match }) => {
  const state = useSelector(state => state.pages.governance.voting);
  const mainState = useSelector(state => state.pages.governance.main);
  const nodeTypeIds = [BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS, BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES];
  const nodeTypeId = Number(match.params.nodeTypeId);
  const dispatch = useDispatch();

  const getNodes = async (page, orderBy) => {
    try {
      await withLoader(dispatch(governancePageActions.votingGetNodes(nodeTypeId, page, orderBy)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  useEffect(() => {
    dispatch(governancePageActions.votingSetNodesToVote(mainState.selectedIds[nodeTypeId]));
  }, [mainState.selectedIds[nodeTypeId]]);

  useEffect(() => {
    getNodes(1, state.metadata.orderBy);

    return () => {
      dispatch(governancePageActions.votingReset());
    };
  }, []);

  if (!nodeTypeIds.includes(nodeTypeId)) {
    return null;
  }

  return (
    <Switch>
      <Route exact path={urls.getGovernanceVotingUrl(':nodeTypeId')} component={Election} />
      <Route exact path={urls.getGovernanceCastUrl(':nodeTypeId')} component={Cast} />
    </Switch>
  );
};

Voting.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      nodeTypeId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Voting;
