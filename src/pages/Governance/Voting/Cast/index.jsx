import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import Popup, { Content } from '../../../../components/Popup';
import urls from '../../../../utils/urls';
import { BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS } from '../../../../utils/constants';
import { selectOwner, selectNodesByIds } from '../../../../store/selectors';
import UserPickWithIcon from '../../../../components/UserPickWithIcon';
import { TableNodes } from '../../../../components/Table';
import IconDone from '../../../../components/Icons/Done';
import IconFail from '../../../../components/Icons/Fail';
import Button from '../../../../components/Button/index';
import PanelWrapper from '../../../../components/Panel/PanelWrapper';
import RequestActiveKey from '../../../../components/Auth/Features/RequestActiveKey';
import { addErrorNotificationFromResponse, addSuccessNotification } from '../../../../actions/notifications';
import { authShowPopup } from '../../../../actions/auth';
import withLoader from '../../../../utils/withLoader';
import { getUserName } from '../../../../utils/user';
import * as governancePageActions from '../../../../actions/pages/governance';
import styles from '../styles.css';

const Cast = ({ history, match }) => {
  const [loading, setLoading] = useState(false);
  const nodeTypeId = Number(match.params.nodeTypeId);
  const state = useSelector(state => state.pages.governance.voting);
  const owner = useSelector(selectOwner);
  const nodesToVote = useSelector(selectNodesByIds(state.nodesToVoteIds));
  const dispatch = useDispatch();

  const close = () => {
    history.push(urls.getGovernanceVotingUrl(nodeTypeId));
  };

  const vote = async (activeKey) => {
    setLoading(true);
    try {
      await withLoader(dispatch(governancePageActions.voteForNodes(owner.accountName, nodesToVote, activeKey, nodeTypeId)));
      dispatch(addSuccessNotification('Vote for nodes is successful'));
      history.push(urls.getGovernanceUrl());
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setLoading(false);
  };

  return (
    <Popup onClickClose={close}>
      <Content onClickClose={close}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? 'Vote for these producers' : 'Vote for these nodes'}
          </h1>

          <div className={styles.voteTitle}>
            <UserPickWithIcon
              icon={<IconDone />}
              userPick={{
                shadow: true,
                src: urls.getFileUrl(owner.avatarFilename),
                size: 32,
              }}
            />
            {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? 'Block Producers to Vote' : 'Nodes to Vote'}
          </div>

          <div className={styles.table}>
            <TableNodes
              disableSorting
              selectedNodesIds={state.nodesToVoteIds}
              nodesIds={state.nodesToVoteIds}
              onSelect={(nodeId) => {
                dispatch(governancePageActions.votingToggleNode(nodeId));
              }}
            />
          </div>

          <div className={styles.voteTitle}>
            <UserPickWithIcon
              icon={<IconFail />}
              userPick={{
                shadow: true,
                src: urls.getFileUrl(owner.avatarFilename),
                size: 32,
              }}
            />
            {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? 'Block Producers to Unvote' : 'Nodes to Unvote'}
          </div>

          <div className={styles.table}>
            <TableNodes
              disableSorting
              nodesIds={state.nodesToUnVoteIds}
              onSelect={(nodeId) => {
                dispatch(governancePageActions.votingToggleNode(nodeId));
              }}
            />
          </div>

          <div className={styles.panel}>
            <PanelWrapper title="By completing this transaction, I agree to the following…">
              <div className={styles.text}>
                <p>The intent of the ‘voteproducer’ action is to cast a valid vote for up to 30 BP candidates.</p>
                <p>
                  As an authorized party I {getUserName(owner)} wish to vote on behalf of {getUserName(owner)} in favor of the block produser candidates
                  {nodesToVote.length ? nodesToVote.map((node, index) => <strong key={index}> {node.title}, </strong>) : <strong> none </strong>}
                  with a voting weight equal to all tokens currently owned by {getUserName(owner)} and staked for CPU or bandwidth.
                </p>
                <p>If I am not the benefitial owner of these shares I stipulate I have proof that I’ve been authorized to vote these shares by their benefitial owner(s).</p>
                <p>I stipulate I have not and will not accept anything of value in exchange for these votes, on penalty of confiscation of these tokens, and other penalties.</p>
                <p>I acknowledge that using any system of authomatic voting, re-voting, or vote refreshing, or allowing such system to be used on my behalf or on behalf of another, is forbidden and doing so violates this contract.</p>
              </div>
            </PanelWrapper>
          </div>

          <div className={styles.submit}>
            <RequestActiveKey
              onSubmit={vote}
            >
              {requestActiveKey => (
                <Button
                  red
                  big
                  cap
                  width={200}
                  disabled={loading}
                  onClick={() => {
                    if (!owner.id) {
                      dispatch(authShowPopup());
                    } else {
                      requestActiveKey();
                    }
                  }}
                >
                  Vote
                </Button>
              )}
            </RequestActiveKey>
          </div>
        </div>
      </Content>
    </Popup>
  );
};

Cast.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      nodeTypeId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Cast;
