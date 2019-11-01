import { ContentIdGenerator, MultiSignatureApi } from 'ucom-libs-wallet';
import snakes from '../utils/snakes';
import * as keyUtils from '../utils/keys';
import Worker from '../worker';
import api from '../api';
import { getOwnerCredentialsOrShowAuthPopup } from './users';
import { addOrganizations } from './organizations';

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

      await MultiSignatureApi.createMultiSignatureAccount(
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
}
