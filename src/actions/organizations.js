import humps from 'lodash-humps';
import api from '../api';
import { addUsers } from './users';
import { selectOrgById } from '../store/selectors';
import { getOrganizationByIds } from '../store/organizations';

export const addOrganizations = payload => (dispatch) => {
  getOrganizationByIds.cache.clear();
  dispatch({ type: 'ADD_ORGANIZATIONS', payload });
};

export const getOrganization = id => async (dispatch) => {
  try {
    const data = humps(await api.getOrganization(id));
    dispatch(addUsers([data.data.user].concat(data.data.followedBy, data.data.usersTeam)));
    dispatch(addOrganizations([data.data]));
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createOrganization = data => async (dispatch) => {
  try {
    const dataToSave = {
      ...data,
      entityImages: JSON.stringify(data.entityImages),
    };

    const result = await api.createOrganization(dataToSave);

    dispatch(addOrganizations([{
      ...result,
      ...data,
    }]));
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateOrganization = data => async (dispatch) => {
  try {
    const dataToSave = {
      ...data,
      entityImages: JSON.stringify(data.entityImages),
    };

    const result = await api.updateOrganization(dataToSave);

    dispatch(getOrganization(data.id));
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addDiscussion = (postId, orgId) => async (dispatch, getState) => {
  try {
    const state = getState();

    await dispatch(getOrganization(orgId));
    const org = selectOrgById(orgId)(state);
    const discussions = [{ id: postId }].concat(org.discussions.map(({ id }) => ({ id })));
    await api.setDiscussions(orgId, { discussions });
  } catch (err) {
    throw err;
  }
};
