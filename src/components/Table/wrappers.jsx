import { endsWith } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import Table from './index';
import Badge from '../Badge';
import IconDone from '../Icons/Done';
import UserPickWithIcon from '../UserPickWithIcon';
import Checkbox from '../Checkbox';
import { selectNodesByIds, selectOwner } from '../../store/selectors';
import { formatScaledImportance } from '../../utils/rate';
import { getBpStatusById } from '../../utils/nodes';
import { BP_STATUS_ACTIVE_ID, PRODUCERS_LIMIT } from '../../utils/constants';
import urls from '../../utils/urls';

export const TableNodes = ({
  nodesIds, selectedNodesIds, orderBy, disableSorting, onSelect, ...props
}) => {
  const nodes = useSelector(selectNodesByIds(nodesIds));
  const owner = useSelector(selectOwner);
  const hasSelected = nodesIds.some(i => selectedNodesIds.includes(i));

  return (
    <Table
      {...props}
      cols={[
        ...(onSelect ? [{
          width: '24px',
        }] : hasSelected ? [{
          width: '32px',
        }] : []),

        ...[{
          title: 'Organization',
          width: 'auto',
          name: 'title',
          sortable: !disableSorting,
          sorted: endsWith(orderBy, 'title'),
          reverse: orderBy[0] !== '-',
        }, {
          title: 'Votes',
          right: true,
          width: '60px',
          name: 'votes_count',
          sortable: !disableSorting,
          sorted: endsWith(orderBy, 'votes_count'),
          reverse: orderBy[0] !== '-',
        }, {
          title: 'Vote amount',
          hideOnSmall: true,
          right: true,
          width: '120px',
          name: 'votes_amount',
          sortable: !disableSorting,
          sorted: endsWith(orderBy, 'votes_amount'),
          reverse: orderBy[0] !== '-',
        }, {
          title: 'State',
          right: true,
          width: '70px',
          name: 'bp_status',
          sortable: !disableSorting,
          sorted: endsWith(orderBy, 'bp_status'),
          reverse: orderBy[0] === '-',
        }],
      ]}
      data={nodes.map(node => ([
        ...(onSelect ? [
          <Checkbox
            isDisabled={!selectedNodesIds.includes(node.id) && selectedNodesIds.length >= PRODUCERS_LIMIT}
            isChecked={selectedNodesIds.includes(node.id)}
            onChange={() => onSelect(node.id)}
          />,
        ] : (hasSelected ? [
          selectedNodesIds.includes(node.id) ? (
            <UserPickWithIcon
              icon={<IconDone />}
              userPick={{
                shadow: true,
                src: urls.getFileUrl(owner.avatarFilename),
                size: 32,
              }}
            />
          ) : null,
        ] : [])),

        ...[
          <nobr><strong>{node.title}</strong></nobr>,
          <nobr>{node.votesCount}<br /><small>{node.votesPercentage}%</small></nobr>,
          <nobr>{formatScaledImportance(node.scaledImportanceAmount, false)}</nobr>,
          <Badge
            strech
            green={node.bpStatus === BP_STATUS_ACTIVE_ID}
          >
            {getBpStatusById(node.bpStatus)}
          </Badge>,
        ],
      ]))}
    />
  );
};

TableNodes.propTypes = {
  nodesIds: PropTypes.arrayOf(PropTypes.number),
  selectedNodesIds: PropTypes.arrayOf(PropTypes.number),
  orderBy: PropTypes.string,
  onSelect: PropTypes.func,
  disableSorting: PropTypes.bool,
};

TableNodes.defaultProps = {
  nodesIds: [],
  selectedNodesIds: [],
  onSelect: undefined,
  disableSorting: false,
  orderBy: 'bp_status',
};
