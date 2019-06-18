const getInitialState = () => ({
  posts: [],
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'MAIN_POSTS_RESET':
      return getInitialState();

    case 'MAIN_POSTS_ADD':
      return {
        ...state,
        posts: state.posts.concat(action.payload),
      };

    default:
      return state;
  }
};
