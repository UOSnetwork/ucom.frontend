import PropTypes from 'prop-types';
import React, { useState } from 'react';
import GovernanceTable from './GovernanceTable';
import Button from '../Button';
import { formatRate } from '../../utils/rate';

const { Dictionary } = require('ucom-libs-wallet');

const BLOCK_PRODUCERS = Dictionary.BlockchainNodes.typeBlockProducer();
const CALCULATOR_NODES = Dictionary.BlockchainNodes.typeCalculator();

const nodeTemplates = {
  [BLOCK_PRODUCERS]: {
    title: ' Block Producer',
    side: 'BP',
    time: {
      caption: '126 Seconds',
      text: 'Your vote is exercised each round of 126 seconds.',
    },
    period: {
      caption: '1 Round',
      text: 'You can change your vote on each round.',
    },
  },
  [CALCULATOR_NODES]: {
    title: ' Calculator Node',
    side: 'Calculator',
    time: {
      caption: 'Immediate',
      text: 'Your vote takes effect immediately.',
    },
    period: {
      caption: 'Perpetual',
      text: 'Once cast, your vote is perpetually exercised. You can change your vote at any time.',
    },
  },
};

const GovernanceElection = (props) => {
  if (!props.currentNodeVisibility) {
    return null;
  }

  const [route, setRoute] = useState(1);
  const {
    title, side, time, period,
  } = nodeTemplates[props.currentNodeVisibility];
  return (
    <div className="governance governance-election">
      <div className="content content_base">
        <div className="content__inner">
          <div className="content__title">
            <h1 className="title">{title} Election</h1>
          </div>
          <div className="governance-election__grid">
            <div className="governance-election__grid-item">
              <div className="title title_small title_bold">{formatRate(props.currentImportance)}°</div>
              <div className="governance-election__status-text">You’re voting with your Importance.</div>
            </div>
            <div className="governance-election__grid-item">
              <div className="title title_small title_bold">30</div>
              <div className="governance-election__status-text">Vote for a maximum of 30 {title}s.</div>
            </div>
            <div className="governance-election__grid-item">
              <div className="title title_small title_bold">Trust</div>
              <div className="governance-election__status-text">You extend your trust to a {title} through voting.</div>
            </div>
            <div className="governance-election__grid-item">
              <div className="title title_small title_bold">{side} Rank</div>
              <div className="governance-election__status-text">The rank of each {title} is affected by the amount of your Importance.</div>
            </div>
            <div className="governance-election__grid-item">
              <div className="title title_small title_bold">{time.caption}</div>
              <div className="governance-election__status-text">{time.text}</div>
            </div>
            <div className="governance-election__grid-item">
              <div className="title title_small title_bold">{period.caption}</div>
              <div className="governance-election__status-text">{period.text}</div>
            </div>
          </div>

          <div className="governance-election__nav-bar">
            <div className="toolbar toolbar_responsive">
              <div className="toolbar__main">
                <div className="menu menu_simple-tabs meny_bottom">
                  <div className="menu__item">
                    <div
                      className={`menu__link title title_small ${route === 1 ? 'menu__link_active' : ''}`}
                      onClick={() => setRoute(1)}
                      role="presentation"
                    >
                      {props.tabTitle}
                    </div>
                  </div>
                  <div className="menu__item_narrow">
                    <div
                      className={`menu__link title title_small ${route === 2 ? 'menu__link_active' : ''}`}
                      onClick={() => setRoute(2)}
                      role="presentation"
                    >
                      {props.selectedNodes.length} Selected
                    </div>
                  </div>
                  <div className="menu__item_narrow menu__item_left">
                    <Button
                      theme="red-white"
                      text="Cast your vote"
                      onClick={() => props.setConfirmationVisibility(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="governance-table__head">
              <div className="governance-table__row governance-table__row_flex">
                {props.user.id &&
                  <div className="governance-table__cell governance-table__cell_id" />
                }
                <div className="governance-table__cell governance-table__cell_name governance-table__cell_name_flex ">
                  <span className="inline inline_small">
                    <span className="inline__item">Organization</span>
                  </span>
                </div>
                <div className="governance-table__cell only-phone governance-table__cell_votes">Votes</div>
                <div className="governance-table__cell only-pad governance-table__cell_amount">Vote Amount</div>
                <div className="governance-table__cell governance-table__cell_state">State</div>
              </div>
            </div>
          </div>

          <div className="governance-all__table governance-all__without-table">
            {route === 1 ?
              <GovernanceTable
                withoutTable
                phoneMod
                data={props.table}
              /> : null
            }
            {route === 2 ?
              <GovernanceTable
                withoutTable
                phoneMod
                data={props.selectedNodes}
              /> : null
            }
          </div>
        </div>
      </div>
    </div>
  );
};

GovernanceElection.propTypes = {
  tabTitle: PropTypes.string,
};

GovernanceElection.defaultProps = {
  tabTitle: 'Select Block Producers',
};

export default GovernanceElection;

