import { ContentIdGenerator } from 'ucom-libs-wallet';
import snakes from '../utils/snakes';
import * as keyUtils from '../utils/keys';
import Worker from '../worker';
import api from '../api';
import { getOwnerCredentialsOrShowAuthPopup } from './users';
import { addOrganizations } from './organizations';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';

export default class {
  static createOrg(activeKey, data) {
    return async (dispatch) => {
      const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

      if (!ownerCredentials) {
        return null;
      }

      await Worker.addSocialPermissionsToProposeApproveAndExecute(ownerCredentials.accountName, activeKey);

      const blockchainId = ContentIdGenerator.getForOrganization();

      const teamMembersNames = data.usersTeam.map(u => u.accountName);

      const content = snakes({
        ...data,
        blockchainId,
        entityImages: JSON.stringify(data.entityImages),
      });

      await Worker.createMultiSignatureAccount(
        ownerCredentials.accountName,
        activeKey,
        data.nickname,
        activeKey,
        keyUtils.getPublicKeyByPrivateKey(activeKey),
        keyUtils.getPublicKeyByPrivateKey(keyUtils.getActiveKeyByOwnerKey(activeKey)),
        content,
        teamMembersNames,
      );

      content.is_multi_signature = true;

      const org = await api.createOrganization(content);

      dispatch(addOrganizations([{ ...org, ...data }]));

      return org;
    };
  }

  static updateOrg(activeKey, data) {
    return async (dispatch) => {
      const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

      if (!ownerCredentials) {
        return null;
      }

      const content = snakes({
        ...data,
        entityImages: JSON.stringify(data.entityImages),
      });

      const membersNames = data.usersTeam.map(u => u.accountName);
      const membersChanged = await Worker.areSocialMembersChanged(data.nickname, membersNames);
      let signed_transaction;

      if (membersChanged) {
        signed_transaction = await Worker.createAndExecuteProfileUpdateAndSocialMembers(
          ownerCredentials.accountName,
          activeKey,
          data.nickname,
          content,
          membersNames,
        );
      } else {
        signed_transaction = await Worker.multiSignUpdateProfile(
          ownerCredentials.accountName,
          ownerCredentials.socialKey,
          TRANSACTION_PERMISSION_SOCIAL,
          data.nickname,
          content,
        );
      }

      const org = await api.updateOrganization({
        ...content,
        signed_transaction: JSON.stringify(signed_transaction),
      });

      dispatch(addOrganizations([{ ...org, ...data }]));

      return org;
    };
  }
}
