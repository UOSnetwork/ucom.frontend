import { getUsersByIds, getUserById } from '../users';
import { getOrganizationByIds } from '../organizations';
import { getTagsByTitle } from '../tags';
import { getPostByIds } from '../posts';

export const selectUsersByIds = (ids = []) => state => getUsersByIds(state.users, ids);
export const selectOrgsByIds = (ids = []) => state => getOrganizationByIds(state.organizations, ids);
export const selectTagsByTitles = (titles = []) => state => getTagsByTitle(state.tags, titles);
export const selectPostsByIds = (ids = []) => state => getPostByIds(state.posts, ids);
export const selectOwner = state => getUserById(state.users, state.user.data.id) || {};

export * from './user';
