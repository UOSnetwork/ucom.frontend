import humps from 'lodash-humps';
import api from '../api';
import { addUsers } from './users';
import { selectOrgById } from '../store/selectors';
import { getOrganizationByIds } from '../store/organizations';
import snakes from '../utils/snakes';
import { TRANSACTION_PERMISSION_SOCIAL } from '../utils/constants';
import Worker from '../worker';

export const addOrganizations = payload => (dispatch) => {
  getOrganizationByIds.cache.clear();
  dispatch({ type: 'ADD_ORGANIZATIONS', payload });
};

export const getOrganization = id => async (dispatch) => {
  const data = humps(await api.getOrganization(id));

  dispatch(addUsers([data.data.user].concat(data.data.followedBy, data.data.usersTeam)));
  dispatch(addOrganizations([data.data]));

  return data.data;
};

export const saveOrganization = (
  ownerAccountName,
  ownerPrivateKey,
  orgId,
  orgBlockchainId,
  data,
) => async (dispatch) => {
  const content = snakes({
    ...data,
    entityImages: JSON.stringify(data.entityImages),
  });
  let signed_transaction;
  let blockchain_id;
  let org;

  if (!orgBlockchainId) {
    ({ signed_transaction, blockchain_id } = await Worker.signCreateOrganization(
      ownerAccountName,
      ownerPrivateKey,
      content,
      TRANSACTION_PERMISSION_SOCIAL,
    ));
  } else {
    signed_transaction = await Worker.signUpdateOrganization(
      ownerAccountName,
      ownerPrivateKey,
      content,
      orgBlockchainId,
      TRANSACTION_PERMISSION_SOCIAL,
    );
  }

  if (!orgId) {
    (org = await api.createOrganization({
      ...content,
      signed_transaction: JSON.stringify(signed_transaction),
      blockchain_id,
    }));

    dispatch(addOrganizations([{ ...org, ...data }]));
  } else {
    (org = await api.updateOrganization({
      ...content,
      signed_transaction: JSON.stringify(signed_transaction),
    }));

    dispatch(getOrganization(data.id));
  }

  return org;
};

export const addDiscussion = (postId, orgId) => async (dispatch, getState) => {
  const state = getState();

  await dispatch(getOrganization(orgId));

  const org = selectOrgById(orgId)(state);
  const discussions = [{ id: postId }].concat(org.discussions.map(({ id }) => ({ id })));

  await api.setDiscussions(orgId, { discussions });
};
