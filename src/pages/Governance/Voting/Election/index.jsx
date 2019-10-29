import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { Fragment, useState } from 'react';
import Popup, { Content } from '../../../../components/Popup';
import VotingFeatures from '../Features';
import Button from '../../../../components/Button/index';
import { TableNodes } from '../../../../components/Table';
import Pagination from '../../../../components/Pagination';
import urls from '../../../../utils/urls';
import { formatScaledImportance } from '../../../../utils/rate';
import withLoader from '../../../../utils/withLoader';
import { selectOwner } from '../../../../store/selectors';
import * as governancePageActions from '../../../../actions/pages/governance';
import { addErrorNotificationFromResponse } from '../../../../actions/notifications';
import { BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS, PRODUCERS_LIMIT } from '../../../../utils/constants';
import styles from '../styles.css';

const Voting = ({ history, match }) => {
  const { t } = useTranslation();
  const owner = useSelector(selectOwner);
  const state = useSelector(state => state.pages.governance.voting);
  const nodeTypeId = Number(match.params.nodeTypeId);
  const [showSelected, setShowSelected] = useState(false);
  const dispatch = useDispatch();

  const close = () => {
    history.push(urls.getGovernanceUrl());
  };

  const getNodes = async (page, orderBy) => {
    try {
      await withLoader(dispatch(governancePageActions.votingGetNodes(nodeTypeId, page, orderBy)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  return (
    <Popup onClickClose={close}>
      <Content onClickClose={close}>
        <div className={styles.content}>
          {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? (
            <Fragment>
              <h1 className={styles.title}>{t('Block Producer Election')}</h1>
              <VotingFeatures
                items={[{
                  title: formatScaledImportance(owner.scaledImportance),
                  text: t('You’re voting with your Importance.'),
                }, {
                  title: PRODUCERS_LIMIT,
                  text: t('Vote for a maximum of Block Producers.', { limit: PRODUCERS_LIMIT }),
                }, {
                  title: t('Trust'),
                  text: t('You extend your trust to a Block Producer through voting.'),
                }, {
                  title: t('BP Rank'),
                  text: t('The rank of each Block Producer is affected by the amount of your Importance.'),
                }, {
                  title: t('126 Seconds'),
                  text: t('Your vote is exercised each round of 126 seconds.'),
                }, {
                  title: t('1 Round'),
                  text: t('You can change your vote on each round.'),
                }]}
              />
            </Fragment>
          ) : (
            <Fragment>
              <h1 className={styles.title}>{t('Calculator Node Election')}</h1>
              <VotingFeatures
                items={[{
                  title: formatScaledImportance(owner.scaledImportance),
                  text: t('You’re voting with your Importance.'),
                }, {
                  title: PRODUCERS_LIMIT,
                  text: t('Vote for a maximum of Calculator Nodes.', { limit: PRODUCERS_LIMIT }),
                }, {
                  title: t('Trust'),
                  text: t('You extend your trust to a Calculator Node through voting.'),
                }, {
                  title: t('Calculator Rank'),
                  text: t('The rank of each Calculator Node is affected by the amount of your Importance.'),
                }, {
                  title: t('Immediate'),
                  text: t('Your vote takes effect immediately.'),
                }, {
                  title: t('Perpetual'),
                  text: t('Once cast, your vote is perpetually exercised. You can change your vote at any time.'),
                }]}
              />
            </Fragment>
          )}

          <div className={styles.actions}>
            <div className={styles.tabs}>
              <div
                role="presentation"
                className={classNames({
                  [styles.item]: true,
                  [styles.active]: !showSelected,
                })}
                onClick={() => setShowSelected(false)}
              >
                {nodeTypeId === BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS ? t('Select Block Producers') : t('Select Calculator Nodes')}
              </div>
              <div
                role="presentation"
                className={classNames({
                  [styles.item]: true,
                  [styles.active]: showSelected,
                })}
                onClick={() => setShowSelected(true)}
              >
                {state.nodesToVoteIds.length} {t('Selected')}
              </div>
            </div>
            <div className={styles.submit}>
              <Button
                redBorder
                url={urls.getGovernanceCastUrl(nodeTypeId)}
              >
                {t('Cast your vote')}
              </Button>
            </div>
          </div>

          <div className={styles.table}>
            <TableNodes
              nodesIds={showSelected ? state.nodesToVoteIds : state.ids}
              orderBy={state.metadata.orderBy}
              selectedNodesIds={state.nodesToVoteIds}
              disableSorting={showSelected}
              onSelect={(nodeId) => {
                dispatch(governancePageActions.votingToggleNode(nodeId));
              }}
              onSort={(col) => {
                getNodes(
                  state.metadata.page,
                  col.name === 'bp_status'
                    ? (!col.sorted || col.reverse ? col.name : `-${col.name}`)
                    : (!col.sorted || col.reverse ? `-${col.name}` : col.name),
                );
              }}
            />
          </div>

          {!showSelected &&
            <Pagination
              {...state.metadata}
              onChange={(page) => {
                getNodes(page, state.metadata.orderBy);
              }}
            />
          }
        </div>
      </Content>
    </Popup>
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
