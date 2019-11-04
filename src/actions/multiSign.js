import { omit } from 'lodash';
import { ContentIdGenerator } from 'ucom-libs-wallet';
import snakes from '../utils/snakes';
import * as keyUtils from '../utils/keys';
import Worker from '../worker';
import api from '../api';
import { getOwnerCredentialsOrShowAuthPopup } from './users';
import { addOrganizations } from './organizations';
import { TRANSACTION_PERMISSION_SOCIAL, POST_TYPE_MEDIA_ID } from '../utils/constants';
import { selectOrgById, selectPostById } from '../store';

export default class {
  static createOrg(activeKey, data, isMigrate) {
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

      let org;

      if (isMigrate) {
        content.accountName = data.nickname;
        org = await api.migrateOrganization(data.id, content);
      } else {
        org = await api.createOrganization(content);
      }

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

  static createPost(orgId, content) {
    return async (dispatch, getState) => {
      const state = getState();
      const org = selectOrgById(orgId)(state);

      if (!orgId) {
        throw new Error('Organization id is required argument');
      }

      if (!org) {
        throw new Error(`Organization with id ${content.organizationId} not found`);
      }

      const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

      if (!ownerCredentials) {
        return null;
      }

      const { action, blockchain_id } = await Worker.getCreatePublicationFromOrganizationAction(
        org.nickname,
        org.blockchainId,
        content,
      );

      await Worker.proposeApproveAndExecuteByProposer(
        ownerCredentials.accountName,
        ownerCredentials.socialKey,
        TRANSACTION_PERMISSION_SOCIAL,
        [action],
      );

      const data = {
        ...omit(content, ['entity_tags']),
        blockchain_id,
        organization_id: orgId,
        post_type_id: POST_TYPE_MEDIA_ID,
      };

      const result = await api.createPost(data);

      return result;
    };
  }

  static updatePost(orgId, postId, content) {
    return async (dispatch, getState) => {
      if (!orgId) {
        throw new Error('Organization id is required argument');
      }

      if (!postId) {
        throw new Error('Post id is required argument');
      }

      const state = getState();
      const org = selectOrgById(orgId)(state);

      if (!org) {
        throw new Error(`Organization with id ${content.organizationId} not found`);
      }

      const post = selectPostById(postId)(state);

      if (!post) {
        throw new Error(`Post with id ${content.organizationId} not found`);
      }

      const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

      if (!ownerCredentials) {
        return null;
      }

      const updatePostAction = await Worker.getUpdatePublicationFromOrganizationAction(
        org.nickname,
        org.blockchainId,
        content,
        post.blockchainId,
      );

      await Worker.proposeApproveAndExecuteByProposer(
        ownerCredentials.accountName,
        ownerCredentials.socialKey,
        TRANSACTION_PERMISSION_SOCIAL,
        [updatePostAction],
      );

      const data = {
        ...omit(content, ['entity_tags']),
        organization_id: orgId,
        post_type_id: POST_TYPE_MEDIA_ID,
      };

      const result = await api.updatePost(data, postId);

      return result;
    };
  }
}
