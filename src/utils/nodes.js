import { BP_STATUS_ACTIVE_ID, BP_STATUS_BACKUP_ID } from './constants';

export const getBpStatusById = (id) => {
  switch (id) {
    case BP_STATUS_ACTIVE_ID:
      return 'Active';

    case BP_STATUS_BACKUP_ID:
    default:
      return 'Backup';
  }
};
