import { useTranslation } from 'react-i18next';
import Tippy from '@tippy.js/react';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutBase, Content } from '../../components/Layout';
import UserPick from '../../components/UserPick';
import Footer from '../../components/Footer';
import {
  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
} from '../../utils/constants';
import * as governancePageActions from '../../actions/pages/governance';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import VoteSection from './VoteSection';
import Voting from './Voting';
import urls from '../../utils/urls';
import { formatScaledImportance, formatRate } from '../../utils/rate';
import { getUosGroupId } from '../../utils/config';
import { selectOwner, selectOrgById } from '../../store/selectors';
import { getOrganization } from '../../actions/organizations';
import withLoader from '../../utils/withLoader';
import styles from './styles.css';

const GovernancePage = () => {
  const { t } = useTranslation();
  const state = useSelector(state => state.pages.governance.main);
  const owner = useSelector(selectOwner);
  const org = useSelector(selectOrgById(getUosGroupId()));
  const dispatch = useDispatch();

  const getOrg = async () => {
    try {
      await withLoader(dispatch(getOrganization(getUosGroupId())));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const getNodes = async (nodeType, page, orderBy) => {
    try {
      await withLoader(dispatch(governancePageActions.getNodes(nodeType, page, orderBy)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const getSelectedNodes = async (userId) => {
    try {
      await withLoader(dispatch(governancePageActions.getSelectedNodes(userId)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const toggleSection = (nodeType) => {
    getNodes(nodeType, 1, state.nodes[nodeType].metadata.orderBy);
    dispatch(governancePageActions.toggleSection(state.activeSectionId, nodeType));
  };

  useEffect(() => {
    if (owner.id) {
      getSelectedNodes(owner.id);
    }
  }, [owner.id]);

  useEffect(() => {
    getOrg();

    return () => {
      dispatch(governancePageActions.reset());
    };
  }, []);

  return (
    <Fragment>
      <Switch>
        <Route path={urls.getGovernanceVotingUrl(':nodeTypeId')} component={Voting} />
      </Switch>

      <LayoutBase>
        <Content>
          <div className={styles.header}>
            <div className={styles.info}>
              <h1 className={styles.title}>Governance</h1>
              {owner.id &&
                <div className={styles.rate}>
                  Voting Power: <big>{formatScaledImportance(owner.scaledImportance)}</big>
                </div>
              }
            </div>

            <div className={styles.tabs}>
              <div className={styles.active}>Network</div>
              <div><Tippy arrow placement="bottom" content="Coming Soon"><span>{t('My Projects')}</span></Tippy></div>
              <div><Tippy arrow placement="bottom" content="Coming Soon"><span>{t('Ideas')}</span></Tippy></div>
              <div><Tippy arrow placement="bottom" content="Coming Soon"><span>{t('Projects')}</span></Tippy></div>
              <div><Tippy arrow placement="bottom" content="Coming Soon"><span>{t('Results')}</span></Tippy></div>
            </div>

            <div className={styles.description}>
              {t('GovernProtocol')}
            </div>
          </div>

          {org &&
            <div className={styles.head}>
              <div className={styles.inner}>
                <UserPick
                  shadow
                  organization
                  size={48}
                  src={urls.getFileUrl(org.avatarFilename)}
                  url={urls.getOrganizationUrl(org.id)}
                />
                <span className={styles.name}>
                  <Link to={urls.getOrganizationUrl(org.id)}>{org.title}</Link>
                </span>
                <span>{formatRate(org.currentRate, true)}</span>
              </div>
            </div>
          }

          <VoteSection
            active={state.activeSectionId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS}
            onToggle={() => toggleSection(BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS)}
            title={t('Block Producers')}
            blurb={t('Ongoing voting')}
            description={t('TheBlockProducersDecentralized')}
            votes={state.selectedIds[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS].length}
            votingUrl={urls.getGovernanceVotingUrl(BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS)}
            table={{
              nodesIds: state.nodes[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS].ids,
              selectedNodesIds: state.selectedIds[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS],
              orderBy: state.nodes[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS].metadata.orderBy,
              onSort: (col) => {
                getNodes(
                  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
                  state.nodes[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS].metadata.page,
                  col.name === 'bp_status'
                    ? (!col.sorted || col.reverse ? col.name : `-${col.name}`)
                    : (!col.sorted || col.reverse ? `-${col.name}` : col.name),
                );
              },
            }}
            pagination={{
              ...state.nodes[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS].metadata,
              onChange: (page) => {
                getNodes(BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS, page, state.nodes[BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS].metadata.orderBy);
              },
            }}
          />

          <VoteSection
            active={state.activeSectionId === BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES}
            onToggle={() => toggleSection(BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES)}
            title={t('Calculator Nodes')}
            blurb={t('Ongoing voting')}
            description={t('CalculatorNodeIs')}
            votes={state.selectedIds[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES].length}
            votingUrl={urls.getGovernanceVotingUrl(BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES)}
            table={{
              nodesIds: state.nodes[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES].ids,
              selectedNodesIds: state.selectedIds[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES],
              orderBy: state.nodes[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES].metadata.orderBy,
              onSort: (col) => {
                getNodes(
                  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
                  state.nodes[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES].metadata.page,
                  col.name === 'bp_status'
                    ? (!col.sorted || col.reverse ? col.name : `-${col.name}`)
                    : (!col.sorted || col.reverse ? `-${col.name}` : col.name),
                );
              },
            }}
            pagination={{
              ...state.nodes[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES].metadata,
              onChange: (page) => {
                getNodes(BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES, page, state.nodes[BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES].metadata.orderBy);
              },
            }}
          />

          <Footer />
        </Content>
      </LayoutBase>
    </Fragment>
  );
};

export default GovernancePage;
