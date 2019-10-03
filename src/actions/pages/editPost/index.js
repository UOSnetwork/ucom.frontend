import { pick, isObject, omit } from 'lodash';
import api from '../../../api';
import { createMediaPost, updateMediaPost } from '../../posts';
import { parseMediumContent, mediumHasContent } from '../../../utils/posts';
import * as entityImagesUtils from '../../../utils/entityImages';
import { ENTITY_IMAGES_SYMBOLS_LIMIT, ENTITY_IMAGES_SYMBOLS_LIMIT_ERROR, POSTS_DRAFT_LOCALSTORAGE_KEY } from '../../../utils/constants';
import { getOwnerCredentialsOrShowAuthPopup } from '../../users';
import { addDiscussion } from '../../organizations';

export const reset = () => ({ type: 'EDIT_POST_PAGE_RESET' });

export const setData = payload => ({ type: 'EDIT_POST_PAGE_SET_DATA', payload });

export const setLoading = loading => dispatch => dispatch(setData({ loading }));

export const fetch = postId => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const data = await api.getPost(postId);
    dispatch(setData({
      data,
      loading: false,
      loaded: true,
    }));
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const save = orgId => async (dispatch, getState) => {
  const ownerCredentials = dispatch(getOwnerCredentialsOrShowAuthPopup());

  if (!ownerCredentials) {
    return null;
  }

  const state = getState();
  const pageState = state.pages.editPost;
  const savePostAction = pageState.data.id ? updateMediaPost : createMediaPost;
  const postData = {
    ...pageState.data,
    entityImages: JSON.stringify(pageState.data.entityImages || {}),
  };

  if (!mediumHasContent(postData.description)) {
    throw new Error('Content is required');
  }

  if (!postData.title) {
    throw new Error('Preview title is required');
  }

  if (!postData.leadingText) {
    throw new Error('Preview description is required');
  }

  try {
    dispatch(setLoading(true));

    const result = await dispatch(savePostAction(postData, ownerCredentials.accountName, ownerCredentials.socialKey));
    const postId = result.id || result.postId;

    if (orgId) {
      await dispatch(addDiscussion(postId, orgId));
    }

    localStorage.removeItem(POSTS_DRAFT_LOCALSTORAGE_KEY);
    dispatch(setLoading(false));
    return postId;
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const restoreData = () => (dispatch) => {
  try {
    const json = localStorage.getItem(POSTS_DRAFT_LOCALSTORAGE_KEY);
    const data = JSON.parse(json);
    if (isObject(data)) {
      dispatch(setData({ data }));
    }
  } catch (err) {
    console.error(err);
  }
};

export const changeData = data => (dispatch, getState) => {
  const state = getState();
  const pageState = state.pages.editPost;

  dispatch(setData({ data }));

  if (!pageState.data.id) {
    const dataToSave = JSON.stringify(omit(pageState.data, ['organizationId']));
    localStorage.setItem(POSTS_DRAFT_LOCALSTORAGE_KEY, dataToSave);
  }
};

export const changeContent = (html, urls) => (dispatch, getState) => {
  const state = getState();
  const pageState = state.pages.editPost;
  const data = parseMediumContent(html);
  const dataToSave = pageState.data.id ? pick(data, ['description', 'entityImages']) : data;
  dataToSave.entityImages = entityImagesUtils.filterEmbedsByUrls(pageState.data.entityImages, urls);
  dispatch(changeData(dataToSave));
};

export const addEmbed = embedData => (dispatch, getState) => {
  const state = getState();
  const pageState = state.pages.editPost;
  const entityImages = entityImagesUtils.addEmbed(pageState.data.entityImages, embedData);

  if (JSON.stringify(entityImages).length > ENTITY_IMAGES_SYMBOLS_LIMIT) {
    throw new Error(ENTITY_IMAGES_SYMBOLS_LIMIT_ERROR);
  }

  dispatch(changeData({ entityImages }));
};

export const changeCover = file => async (dispatch, getState) => {
  dispatch(setLoading(true));

  const state = getState();
  const pageState = state.pages.editPost;

  try {
    const data = await api.uploadOneImage(file);
    const { url } = data.files[0];
    dispatch(changeData({
      entityImages: entityImagesUtils.changePostCover(pageState.data.entityImages, url),
    }));
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};
