import api from '../api';
import { POST_TYPE_MEDIA_ID } from '../utils/posts';

export const getMainPosts = () => async (dispatch) => {
  try {
    const data = await api.getPosts({
      postTypeId: POST_TYPE_MEDIA_ID,
      sortBy: '-current_rate',
    });
    dispatch({ type: 'MAIN_POSTS_RESET' });
    dispatch({ type: 'MAIN_POSTS_ADD', payload: data.data });
  } catch (err) {
    throw err;
  }
};
