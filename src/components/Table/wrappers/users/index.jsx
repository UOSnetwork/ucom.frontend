import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { endsWith } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUsersByIds } from '../../../../store/selectors';
import EntryCard from '../../../EntryCard';
import Table from '../../index';
import urls from '../../../../utils/urls';
import { getUserName } from '../../../../utils/user';
import { formatRate, formatScaledImportance } from '../../../../utils/rate';
import styles from './styles.css';

const TableUsers = ({
  userIds, orderBy, startIndex, ...props
}) => {
  const { t } = useTranslation();
  const users = useSelector(selectUsersByIds(userIds));

  return (
    <Table
      {...props}
      cols={[{
        title: '#',
        width: '30px',
        minWidth: '30px',
        hideOnSmall: true,
        sortable: false,
      }, {
        title: t('Name'),
        width: 'auto',
        minWidth: '150px',
        sortable: true,
        sorted: endsWith(orderBy, 'account_name'),
        name: 'account_name',
        reverse: orderBy[0] !== '-',
      }, {
        title: t('Social activity'),
        width: '120px',
        minWidth: '120px',
        sortable: true,
        sorted: endsWith(orderBy, 'current_rate'),
        name: 'current_rate',
        reverse: orderBy[0] !== '-',
      }, {
        title: t('Importance'),
        width: '120px',
        minWidth: '120px',
        sortable: true,
        sorted: endsWith(orderBy, 'scaled_importance'),
        name: 'scaled_importance',
        reverse: orderBy[0] !== '-',
      }]}
      data={users.map((user, index) => ([
        <span className={styles.index}>{startIndex + index}</span>,
        <EntryCard
          avatarSrc={urls.getFileUrl(user.avatarFilename)}
          url={urls.getUserUrl(user.id)}
          title={getUserName(user)}
          nickname={user.accountName}
          disableRate
        />,
        <span className={styles.rate}>{formatRate(user.currentRate, true)}</span>,
        <span className={styles.rate}>{formatScaledImportance(user.scaledImportance)}</span>,
      ]))}
    />
  );
};

TableUsers.propTypes = {
  userIds: PropTypes.arrayOf(PropTypes.number),
  orderBy: PropTypes.string.isRequired,
  startIndex: PropTypes.number,
};

TableUsers.defaultProps = {
  userIds: [],
  startIndex: 1,
};

export default TableUsers;
