import humps from 'lodash-humps';
import api from '../api';
import { addUsers } from './users';
import { getToken } from '../utils/token';

export const addOrganizations = payload => ({ type: 'ADD_ORGANIZATIONS', payload });
export const addOrganizationFollower = payload => ({ type: 'ADD_ORGANIZATION_FOLLOWER', payload });
export const removeOrganizationFollower = payload => ({ type: 'REMOVE_ORGANIZATION_FOLLOWER', payload });

export const getOrganization = id => async (dispatch) => {
  try {
    const data = humps(await api.getOrganization(id));
    dispatch(addUsers([data.data.user].concat(data.data.followedBy, data.data.usersTeam)));
    dispatch(addOrganizations([data.data]));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateOrganization = data => async (dispatch) => {
  try {
    await api.updateOrganization(data);
    dispatch(getOrganization(data.id));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const followOrganization = ({
  organization,
  owner,
  activeKey,
}) => async (dispatch) => {
  try {
    await api.followOrganization(
      organization.id,
      getToken(),
      owner.accountName,
      organization.blockchainId,
      activeKey,
    );
    dispatch(addOrganizationFollower({
      organizationId: organization.id,
      user: owner,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const unfollowOrganization = ({
  organization,
  owner,
  activeKey,
}) => async (dispatch) => {
  try {
    await api.unfollowOrganization(
      organization.id,
      getToken(),
      owner.accountName,
      organization.blockchainId,
      activeKey,
    );
    dispatch(removeOrganizationFollower({
      organizationId: organization.id,
      user: owner,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};
