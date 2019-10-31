import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import Popup, { Content } from '../../../../components/Popup';
import urls from '../../../../utils/urls';
import { BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS, BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES } from '../../../../utils/constants';
import { selectOwner, selectNodesByIds } from '../../../../store/selectors';
import UserPickWithIcon from '../../../../components/UserPickWithIcon';
import { TableNodes } from '../../../../components/Table';
import IconDone from '../../../../components/Icons/Done';
import IconFail from '../../../../components/Icons/Fail';
import Button from '../../../../components/Button/index';
import { PanelWrapper } from '../../../../components/Panel';
import RequestActiveKey from '../../../../components/Auth/Features/RequestActiveKey';
import { addErrorNotificationFromResponse, addSuccessNotification } from '../../../../actions/notifications';
import { authShowPopup } from '../../../../actions/auth';
import withLoader from '../../../../utils/withLoader';
import { getUserName } from '../../../../utils/user';
import * as governancePageActions from '../../../../actions/pages/governance';
import styles from '../styles.css';

const Cast = ({ history, match }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const nodeTypeId = Number(match.params.nodeTypeId);
  const state = useSelector(state => state.pages.governance.voting);
  const owner = useSelector(selectOwner);
  const nodesToVote = useSelector(selectNodesByIds(state.nodesToVoteIds));
  const dispatch = useDispatch();

  const close = () => {
    history.push(urls.getGovernanceVotingUrl(nodeTypeId));
  };

  const onSuccess = () => {
    dispatch(governancePageActions.setSelectedNodes(nodesToVote.map(i => i.id), nodeTypeId));
    dispatch(addSuccessNotification(t('Vote for nodes is successful')));
    history.push(urls.getGovernanceUrl());
  };

  const onError = (err) => {
    dispatch(addErrorNotificationFromResponse(err));
    console.error(err);
  };

  const onSubmit = async (activeKey) => {
    setLoading(true);
    try {
      await withLoader(dispatch(governancePageActions.voteForNodes(owner.accountName, nodesToVote, activeKey, nodeTypeId)));
      onSuccess();
    } catch (err) {
      onError(err);
    }
    setLoading(false);
  };

  const onScatterConnect = async (scatter) => {
    setLoading(true);
    try {
      const voteFunctions = {
        [BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS]: scatter.voteForBlockProducers.bind(scatter),
        [BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES]: scatter.voteForCalculatorNodes.bind(scatter),
      };
      const nodes = nodesToVote.map(i => i.title).filter(i => i !== 'eosiomeetone');
      await withLoader(voteFunctions[nodeTypeId](owner.accountName, nodes));
      onSuccess();
    } catch (err) {
      onError(err);
    }
    setLoading(false);
  };

  return (
    <Popup onClickClose={close}>
      <Content onClickClose={close}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? t('Vote for these producers') : t('Vote for these nodes')}
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
            {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? t('Block Producers to Vote') : t('Nodes to Vote')}
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
            {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? t('Block Producers to Unvote') : t('Nodes to Unvote')}
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
            <PanelWrapper title={t('ByCompletingTransaction')}>
              <div className={styles.text}>
                <p>{t('TheIntentVoteproducer')}</p>
                <p>{t('As an authorized party', { userName: getUserName(owner), nodes: nodesToVote.length ? nodesToVote.map(node => node.title).join(', ') : t('none') })}</p>
                <p>{t('IfIAmNotTheBenefitial')}</p>
                <p>{t('IStipulateIHaveNot')}</p>
                <p>{t('IAcknowledgeThatUsing')}</p>
              </div>
            </PanelWrapper>
          </div>

          <div className={styles.submit}>
            <RequestActiveKey
              onSubmit={onSubmit}
              onScatterConnect={onScatterConnect}
            >
              {(requestActiveKey, requestLoading) => (
                <Button
                  red
                  big
                  cap
                  width={200}
                  disabled={loading || requestLoading}
                  onClick={() => {
                    if (!owner.id) {
                      dispatch(authShowPopup());
                    } else {
                      requestActiveKey();
                    }
                  }}
                >
                  {t('Vote')}
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
