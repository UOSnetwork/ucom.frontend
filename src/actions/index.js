// TODO: Refactoring (split and separate to sub files)

import { POSTS_DRAFT_LOCALSTORAGE_KEY } from '../utils/posts';

export const setUser = payload => ({ type: 'SET_USER', payload });
export const setUserLoading = (loading = false) => ({ type: 'SET_LOADING', payload: loading });
export const removeUser = () => ({ type: 'REMOVE_USER' });
export const setPostData = payload => ({ type: 'SET_POST_DATA', payload });
export const setPostDataToLS = () => (dispatch, getState) => {
  const data = getState();
  const postData = {
    id: data.post.data.id,
    title: data.post.data.title,
    leading_text: data.post.data.leading_text,
    description: data.post.data.description,
    entityImages: data.post.data.entityImages,
  };
  if (!data.post.data.id) {
    localStorage.setItem(POSTS_DRAFT_LOCALSTORAGE_KEY, JSON.stringify(postData));
  }
};
export const setDataToStoreToLS = data => (dispatch) => {
  dispatch(setPostData(data));
  dispatch(setPostDataToLS(data));
};
export const resetPost = () => ({ type: 'RESET_POST' });
export const validatePost = () => ({ type: 'VALIDATE_POST' });
export const validatePostField = payload => ({ type: 'VALIDATE_POST_FIELD', payload });
export const postSetSaved = payload => ({ type: 'POST_SET_SAVED', payload });
