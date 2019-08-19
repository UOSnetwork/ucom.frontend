const getInitialState = () => ({
  data: {},
});

const posts = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'POSTS_RESET': {
      return getInitialState();
    }

    case 'ADD_POSTS': {
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.payload
          .reduce((value, item) => ({ ...value, [item.id]: Object.assign({}, state.data[item.id], item) }), {})),
      });
    }

    default: {
      return state;
    }
  }
};

export const getPostById = (posts, postId) => posts.data[postId];

export const getPostByIds = (posts, postIds = []) => postIds.map(id => posts.data[id]);

export const getPostsByUserId = (posts, userId) => (
  Object.entries(posts.data)
    .map(item => item[1])
    .filter(item => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt || b.postStats.createdAt) - new Date(a.createdAt || a.postStats.createdAt))
);

export const getOrganizationPosts = (posts, organizationId) => (
  Object.entries(posts.data)
    .map(item => item[1])
    .filter(item => item.organizationId === organizationId)
    .sort((a, b) => new Date(b.createdAt || b.postStats.createdAt) - new Date(a.createdAt || a.postStats.createdAt))
);

export default posts;
