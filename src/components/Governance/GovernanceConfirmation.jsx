import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import GovernanceTable from './GovernanceTable';
import Button from '../Button';
import Avatar from '../Avatar';
import { IconOK, IconNo } from '../Icons/GovernanceIcons';
import Panel from '../Panel/Panel';
import urls from '../../utils/urls';
import mergeArraysByProperty from '../../utils/mergeArraysByProperty';
import RequestActiveKey from '../Auth/Features/RequestActiveKey';

const GovernanceConfirmation = (props) => {
  const [idList, setListId] = useState([]);
  const [panelActive, setPanelActive] = useState(false);

  const list = props.table.filter(i => idList.includes(i.id));
  const currentIdList = props.selectedNodes.map(e => e.id);
  const listToVote = list.filter(i => currentIdList.includes(i.id));
  const listToUnvote = list.filter(i => !currentIdList.includes(i.id));
  const listToText = listToVote.map(e => e.title);

  useEffect(() => {
    setListId(mergeArraysByProperty(props.oldSelectedNodes, props.selectedNodes, 'id').map(e => e.id));
  }, []);

  return (
    <div className="governance governance-election governance-confirmation">
      <div className="content content_base content_base_low">
        <div className="content__inner">
          <div className="content__title_tall">
            <h1 className="title">{props.title}</h1>
          </div>
          <div className="governance-vote-title">
            <div className="governance-confirmation-avatar">
              <Avatar src={urls.getFileUrl(props.user.avatarFilename)} size="xsmall" icon={<IconOK />} />
            </div>
            <div className="title title_xxsmall title_bold">{props.titleVote}</div>
          </div>
          <div className="governance-all__table governance-all__table_margin">
            <GovernanceTable
              data={listToVote}
              phoneMod
            />
          </div>

          <div className="governance-vote-title">
            <div className="governance-confirmation-avatar">
              <Avatar src={urls.getFileUrl(props.user.avatarFilename)} size="xsmall" icon={<IconNo />} />
            </div>
            <div className="title title_xxsmall title_bold">{props.titleUnvote}</div>
          </div>
          <div className="governance-all__table governance-all__table_margin_low">
            <GovernanceTable
              data={listToUnvote}
              phoneMod
            />
          </div>
          <div className="governance-vote__panel">
            <Panel
              title="By completing this transaction, I agree to the following..."
              active={panelActive}
              onClickToggler={() => setPanelActive(!panelActive)}
            >
              <div className="governance-vote__text">
                <div className="text">
                  <p>The intent of the ‘voteproducer’ action is to cast a valid vote for up to 30 BP candidates.</p>
                  <p>As an authorized party I {props.user.firstName} wish to vote on behalf of {props.user.firstName} in favor of the block produser candidates
                    {listToText.length ? listToText.map((i, index) => (<span key={index}><strong> {i}</strong>{listToText.length === index - 2 ? '' : ','} </span>)) : <strong> None </strong>}
                    with a voting weight equal to all tokens currently owned by {props.user.firstName} and staked for CPU or bandwidth.
                  </p>
                  <p>If I am not the benefitial owner of these shares I stipulate I have proof that I’ve been authorized to vote these shares by their benefitial owner(s).</p>
                  <p>I stipulate I have not and will not accept anything of value in exchange for these votes, on penalty of confiscation of these tokens, and other penalties.</p>
                  <p>I acknowledge that using any system of authomatic voting, re-voting, or vote refreshing, or allowing such system to be used on my behalf or on behalf of another, is forbidden and doing so violates this contract.</p>
                </div>
              </div>
            </Panel>
          </div>
          <div className="governance-button-tall governance-button_center">
            <RequestActiveKey onSubmit={props.setVotes}>
              {requestActiveKey => (
                <Button
                  isUpper
                  isStretched
                  text="Vote"
                  size="big"
                  theme="red"
                  onClick={requestActiveKey}
                />
              )}
            </RequestActiveKey>
          </div>
        </div>
      </div>
    </div>
  );
};

GovernanceConfirmation.propTypes = {
  title: PropTypes.string,
  titleVote: PropTypes.string,
  titleUnvote: PropTypes.string,
};

GovernanceConfirmation.defaultProps = {
  title: 'Vote for these producers',
  titleVote: 'Block Producers to Vote',
  titleUnvote: 'Block Producers to Unvote',
};

export default GovernanceConfirmation;
