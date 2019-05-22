import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tippy';
import { findKey, isEmpty } from 'lodash';
import GovernanceBlock from './GovernanceBlock';
import Button from '../Button';
import Popup from '../Popup';
import ModalContent from '../ModalContent';
import OrganizationHead from '../Organization/OrganizationHead';
import { governanceNodesAll, governanceHideVotePopup, governanceShowVotePopup, voteForNodes, governanceNodesSelected } from '../../actions/governance';
import { getOrganization } from '../../actions/organizations';
import { walletToggleEditStake, walletGetAccount } from '../../actions/walletSimple';
import { fetchMyself } from '../../actions/users';
import { getSelectedNodes } from '../../store/governance';
import { selectUser } from '../../store/selectors/user';
import LayoutBase from '../Layout/LayoutBase';
import { getUosGroupId } from '../../utils/config';
import Footer from '../Footer';
import GovernanceElection from './GovernanceElection';
import GovernanceConfirmation from './GovernanceConfirmation';
import RequestActiveKey from '../Auth/Features/RequestActiveKey';
import { formatRate } from '../../utils/rate';
import withLoader from '../../utils/withLoader';
import { normalizeAmount } from '../../utils/governance';

const { Dictionary } = require('ucom-libs-wallet');

const BLOCK_PRODUCERS = Dictionary.BlockchainNodes.typeBlockProducer();
const CALCULATOR_NODES = Dictionary.BlockchainNodes.typeCalculator();

const nodesType = { [CALCULATOR_NODES]: 'Calculator Nodes', [BLOCK_PRODUCERS]: 'Block Producers' };

const governanceTabs = [
  { name: 'Network', active: true },
  { name: 'My Projects', active: false },
  { name: 'Ideas', active: false },
  { name: 'Projects', active: false },
  { name: 'Results', active: false },
];


const Governance = ({
  user, governanceNodesAll, governanceNodesSelected, getOrganization, governance, rawSelectedNodes, voteForNodes,
}) => {
  const [electionVisibility, setElectionVisibility] = useState(false);
  const [confirmationVisibility, setConfirmationVisibility] = useState(false);
  const [closeVisibility, setCloseVisibility] = useState(false);
  const [nodeVisibility, setNodeVisibility] = useState({ [BLOCK_PRODUCERS]: false, [CALCULATOR_NODES]: false });
  const currentNodeVisibility = findKey(nodeVisibility, i => i);
  const organizationId = getUosGroupId();

  const getNodes = async () => {
    await governanceNodesAll();

    if (user.id && isEmpty(governance.nodes.selectedData)) {
      await governanceNodesSelected(user.id);
    }
  };

  useEffect(() => {
    withLoader(getNodes());
  }, []);

  useEffect(() => {
    if (user.id && !isEmpty(governance.nodes.data)) {
      withLoader(governanceNodesSelected(user.id));
    }
  }, [user.id]);

  useEffect(() => {
    withLoader(getOrganization(organizationId));
  }, [organizationId]);

  const tableBP = governance.nodes.data[BLOCK_PRODUCERS];
  const tableCN = governance.nodes.data[CALCULATOR_NODES];
  const table = governance.nodes.data[currentNodeVisibility];
  const currentImportance = user.uosAccountsProperties && Math.ceil(normalizeAmount(user.uosAccountsProperties.scaledImportance));
  const selectedNodes = rawSelectedNodes[currentNodeVisibility];
  const oldSelectedNodes = governance.nodes.selectedData[currentNodeVisibility];

  const setVotes = (activeKey) => {
    setConfirmationVisibility(false);
    setElectionVisibility(false);
    setCloseVisibility(false);
    voteForNodes(activeKey, currentNodeVisibility);
  };

  const close = () => {
    setConfirmationVisibility(false);
    setCloseVisibility(false);
  };

  return (
    <LayoutBase>
      {electionVisibility && (
        <Popup onClickClose={() => setElectionVisibility(false)}>
          <ModalContent closeText="Close" mod="governance-election" onClickClose={() => setElectionVisibility(false)}>
            <GovernanceElection
              {...{
                currentImportance, table, selectedNodes, setConfirmationVisibility, user, currentNodeVisibility,
              }}
              tabTitle={+currentNodeVisibility === BLOCK_PRODUCERS ? 'Select Block Producers' : 'Select Calculator Nodes'}
            />
          </ModalContent>
        </Popup>
      )}

      {confirmationVisibility && (
        <Popup onClickClose={() => setCloseVisibility(true)}>
          <ModalContent closeText="Close" mod="governance-election" onClickClose={() => setCloseVisibility(true)}>
            <GovernanceConfirmation
              {...{
                selectedNodes, table, user, setVotes, oldSelectedNodes,
              }}
              title={+currentNodeVisibility === BLOCK_PRODUCERS ? 'Vote for these producers' : 'Vote for these nodes'}
              titleVote={+currentNodeVisibility === BLOCK_PRODUCERS ? 'Block Producers to Vote' : 'Nodes to Vote'}
              titleUnvote={+currentNodeVisibility === BLOCK_PRODUCERS ? 'Block Producers to Unvote' : 'Nodes to Unvote'}
            />
          </ModalContent>
        </Popup>
      )}

      {closeVisibility && (
        <Popup onClickClose={() => close()}>
          <ModalContent mod="governance-close" >
            <div className="governance-close">
              <h3 className="title_small title_bold governance-close__title">You didn&apos;t vote for the 30 selected {nodesType[currentNodeVisibility]}</h3>
              <div className="governance-buttons">
                <div className="governance-button">
                  <Button
                    isStretched
                    text="Close"
                    size="medium"
                    theme="light-black"
                    onClick={close}
                  />
                </div>
                <div className="governance-button">
                  <RequestActiveKey onSubmit={setVotes}>
                    {requestActiveKey => (
                      <Button
                        isStretched
                        text="Vote"
                        size="medium"
                        theme="red"
                        onClick={requestActiveKey}
                      />
                    )}
                  </RequestActiveKey>
                </div>
              </div>
            </div>
          </ModalContent>
        </Popup>
      )}

      <div className="governance">
        <div className="content">
          <div className="content__inner governance-inner">
            <div className="governance__main-title">
              <h1 className="title title_bold">Governance</h1>
              {user.id &&
                <div className="governance__status">
                  <span className="governance__status-text">Voting Power:</span>
                  <h3 className="title_small">
                    {formatRate(currentImportance, true)}
                  </h3>
                </div>
              }
            </div>
            <div className="nav-bar__categories nav-bar__categories_governance">
              {governanceTabs.map(item => (
                <div key={item.name} className={`overview__link ${item.active ? 'overview__link_active' : 'overview__link_disabled'}`}>
                  <Tooltip disabled={item.active} position="bottom" arrow title="Coming Soon">{item.name}</Tooltip>
                </div>
              ))}
            </div>
            <div className="governance__section">
              <div className="governance__text">
                Govern the U°OS protocol through voting. You can vote for Block Producers and Calculator Nodes. Vote with your Importance.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="content__inner content__main">
          <div className="sheets">
            <div className="sheets__list">
              <div className="sheets__item sheets__item_governance">
                <OrganizationHead organizationId={organizationId} isGovernance />
              </div>
            </div>

            <div className="sheets__content sheets__content_theme_governance">
              {/* {user.id &&
                <div className="content__section content__section_small">
                  <Panel
                    title={`Selected (${selectedNodes.length})`}
                    active={selectedPanelActive}
                    onClickToggler={() => setSelectedPanelActive(!selectedPanelActive)}
                  >
                    <div className="governance-selected">
                      <div className="governance-selected__table">
                        <GovernanceTable data={selectedNodes} />
                      </div>
                      <div className="governance-selected__actions">
                        <div className="governance-selected__vote">
                          <Button
                            isStretched
                            size="small"
                            theme="red"
                            text="Vote"
                            isDisabled={governance.nodes.loading}
                            onClick={() => governanceShowVotePopup()}
                          />
                        </div>
                      </div>
                    </div>
                  </Panel>
                </div>
              } */}


              <div>
                {tableBP && tableBP.length > 0 &&
                  <GovernanceBlock
                    isAuth={!!user.id}
                    onClickVoteButton={() => setElectionVisibility(true)}
                    myVotes={rawSelectedNodes[BLOCK_PRODUCERS] && rawSelectedNodes[BLOCK_PRODUCERS].length}
                    voters={12345}
                    rate={15000}
                    onClickTick={() => setNodeVisibility({ [CALCULATOR_NODES]: false, [BLOCK_PRODUCERS]: !nodeVisibility[BLOCK_PRODUCERS] })}
                    visibility={nodeVisibility[BLOCK_PRODUCERS]}
                    table={tableBP}
                    title="Block Producers"
                    description="The Block Producers are decentralized entities that keep the chain running by producing blocks. The Block Producers are elected through voting."
                  />
                }
                {tableCN && tableCN.length > 0 &&
                  <GovernanceBlock
                    isAuth={!!user.id}
                    onClickVoteButton={() => setElectionVisibility(true)}
                    myVotes={rawSelectedNodes[CALCULATOR_NODES] && rawSelectedNodes[CALCULATOR_NODES].length}
                    voters={12345}
                    rate={15000}
                    onClickTick={() => setNodeVisibility({ [BLOCK_PRODUCERS]: false, [CALCULATOR_NODES]: !nodeVisibility[CALCULATOR_NODES] })}
                    visibility={nodeVisibility[CALCULATOR_NODES]}
                    table={tableCN}
                    title="Calculator Nodes "
                    description="A Calculator Node is a node on the U°OS blockchain dedicated to calculating the activity of user accounts: social, transactional, stake."
                  />
                }
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </LayoutBase>
  );
};

export default connect(state => ({
  user: selectUser(state),
  governance: state.governance,
  wallet: state.wallet,
  rawSelectedNodes: getSelectedNodes(state),
}), {
  governanceNodesAll,
  governanceHideVotePopup,
  governanceShowVotePopup,
  getOrganization,
  voteForNodes,
  walletGetAccount,
  fetchMyself,
  walletToggleEditStake,
  governanceNodesSelected,
})(Governance);
