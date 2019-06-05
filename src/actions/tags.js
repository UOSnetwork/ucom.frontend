import { addUsers } from './users';
import { addPosts } from './posts';
import { addOrganizations } from './organizations';

export const addTags = (payload = []) => (dispatch) => {
  const tags = [];

  const parseTag = (tag) => {
    if (tag.users && tag.users.data) {
      dispatch(addUsers(tag.users.data));
      tag.users.data = tag.users.data.map(i => i.id);
    }

    if (tag.posts && tag.posts.data) {
      dispatch(addPosts(tag.posts.data));
      tag.posts.data = tag.posts.data.map(i => i.id);
    }

    if (tag.orgs && tag.orgs.data) {
      dispatch(addOrganizations(tag.orgs.data));
      tag.orgs.data = tag.orgs.data.map(i => i.id);
    }

    tags.push(tag);
  };

  payload.forEach(parseTag);
  dispatch({ type: 'ADD_TAGS', payload: tags });
};
