// TODO: Refactoring (css modules, refactoring dependencies)

import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import humps from 'lodash-humps';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import LayoutClean from '../components/Layout/LayoutClean';
import CreateBy from '../components/CreateBy';
import Button from '../components/Button';
import Medium from '../components/Medium/index';
import api from '../api';
import { selectUser } from '../store/selectors';
import { postSetSaved, setPostData, validatePost, resetPost, setDataToStoreToLS } from '../actions';
import { authShowPopup } from '../actions/auth';
import loader from '../utils/loader';
import urls from '../utils/urls';
import Close from '../components/Close';
import { parseMediumContent, mediumHasContent, POSTS_DRAFT_LOCALSTORAGE_KEY } from '../utils/posts';
import Popup from '../components/Popup';
import ModalContent from '../components/ModalContent';
import PostSubmitForm from '../components/Post/PostSubmitForm';
import { addErrorNotification, addErrorNotificationFromResponse } from '../actions/notifications';
import { setDiscussions } from '../actions/organization';
import { getOrganization } from '../actions/organizations';
import { createMediaPost, updateMediaPost } from '../actions/posts';
import { getOrganizationById } from '../store/organizations';
import { addEmbed, filterEmbedsByUrls, ENTITY_IMAGES_SYMBOLS_LIMIT, ENTITY_IMAGES_SYMBOLS_LIMIT_ERROR } from '../utils/entityImages';
import withLoader from '../utils/withLoader';
import { restoreActiveKey } from '../utils/keys';

const EditPost = (props) => {
  const postId = props.match.params.id;
  const urlSearchParams = new URLSearchParams(props.location.search);
  const organizationId = urlSearchParams.get('organizationId');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [submitPopupVisible, setSubmitPopupVisible] = useState(false);
  const organization = getOrganizationById(props.organizations, organizationId);

  const getPost = async () => {
    setLoading(true);

    try {
      const data = await withLoader(api.getPost(props.match.params.id));
      props.dispatch(setPostData(data));
    } catch (err) {
      props.dispatch(addErrorNotificationFromResponse(err));
      console.error(err);
    }

    setLoaded(true);
    setLoading(false);
  };

  const savePost = async () => {
    if (!props.user.id) {
      props.dispatch(authShowPopup());
      return;
    }

    if (!props.post.isValid) {
      props.dispatch(validatePost());
      return;
    }

    const saveFn = postId ? updateMediaPost : createMediaPost;
    setLoading(true);

    try {
      const privateKey = restoreActiveKey();
      const { accountName } = props.user;
      // TODO: Add post tags
      // TODO: Add all editbale field to transactions (all fields which send to api)
      const postData = {
        ...props.post.data,
        entityImages: JSON.stringify(props.post.data.entityImages || {}),
      };
      const data = await withLoader(props.dispatch(saveFn(postData, accountName, privateKey)));
      const postId = data.id || data.postId;

      props.dispatch(postSetSaved(true));
      props.dispatch(setPostData({ id: postId }));

      if (organizationId) {
        props.dispatch(setDiscussions({
          organizationId,
          discussions: [{ id: postId }].concat(organization.discussions.map(i => ({ id: i.id }))),
        }));
      }
    } catch (err) {
      console.error(err);
      props.dispatch(addErrorNotificationFromResponse(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    props.dispatch(resetPost());

    if (postId) {
      getPost(postId);
    } else if (localStorage[POSTS_DRAFT_LOCALSTORAGE_KEY]) {
      const value = localStorage.getItem(POSTS_DRAFT_LOCALSTORAGE_KEY);
      props.dispatch(setPostData(JSON.parse(value)));
    }

    if (organizationId) {
      props.dispatch(getOrganization(organizationId));
    }

    props.dispatch(setPostData({ organizationId }));

    return () => {
      props.dispatch(resetPost());
    };
  }, [postId, organizationId]);

  if (props.post.data.id && props.post.saved) {
    localStorage.removeItem(POSTS_DRAFT_LOCALSTORAGE_KEY);
    return <Redirect to={urls.getPostUrl(humps(props.post.data))} />;
  }

  return (
    <LayoutClean>
      {submitPopupVisible &&
        <Popup onClickClose={() => setSubmitPopupVisible(false)}>
          <ModalContent
            mod={['post-submit', 'small-close']}
            onClickClose={() => setSubmitPopupVisible(false)}
          >
            <PostSubmitForm
              loading={loading}
              onSubmit={() => savePost()}
            />
          </ModalContent>
        </Popup>
      }

      <div className="edit-post">
        <div className="edit-post__container">
          <div className="edit-post__toolbar">
            <div className="edit-post-toolbar">
              <div className="edit-post-toolbar__title">
                <h1 className="title title_xxsmall title_medium">{`${postId ? 'Edit' : 'Create'} Media Post`}</h1>
              </div>
              <div className="edit-post-toolbar__user">
                <CreateBy />
              </div>
              <div className="edit-post-toolbar__action">
                <Button
                  isStretched
                  theme="red"
                  size="small"
                  text="Publish"
                  onClick={() => setSubmitPopupVisible(true)}
                  isDisabled={loading || !mediumHasContent(props.post.data.description)}
                />
              </div>
              <div className="edit-post-toolbar__close">
                <Close />
              </div>
            </div>
          </div>
        </div>

        <div className="edit-post__content">
          {(!postId || loaded) &&
            <Medium
              entityImages={props.post.data.entityImages}
              value={props.post.data.description}
              onChange={({ html, urls }) => {
                const data = parseMediumContent(html);
                let dataToSave = {
                  description: data.description,
                  entityImages: filterEmbedsByUrls(props.post.data.entityImages, urls),
                };

                if (!props.post.data.id) {
                  dataToSave = {
                    ...data,
                    ...dataToSave,
                  };
                }

                props.dispatch(setDataToStoreToLS(dataToSave));
                props.dispatch(validatePost());
              }}
              onUploadStart={() => {
                setLoading(true);
                loader.start();
              }}
              onUploadDone={() => {
                setLoading(false);
                loader.done();
              }}
              onEmbed={(embedData) => {
                const entityImages = addEmbed(props.post.data.entityImages, embedData);

                if (JSON.stringify(entityImages).length > ENTITY_IMAGES_SYMBOLS_LIMIT) {
                  props.dispatch(addErrorNotification(ENTITY_IMAGES_SYMBOLS_LIMIT_ERROR));
                } else {
                  props.dispatch(setDataToStoreToLS({
                    entityImages: addEmbed(props.post.data.entityImages, embedData),
                  }));
                }
              }}
            />
          }
        </div>

        <div className="edit-post__container">
          <div className="edit-post__toolbar">
            <div className="edit-post-toolbar">
              <div className="edit-post-toolbar__user">
                <CreateBy />
              </div>
              <div className="edit-post-toolbar__action">
                <Button
                  isStretched
                  theme="red"
                  size="small"
                  text="Publish"
                  onClick={() => setSubmitPopupVisible(true)}
                  isDisabled={loading || !mediumHasContent(props.post.data.description)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutClean>
  );
};

EditPost.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      organizationId: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(state => ({
  organizations: state.organizations,
  user: selectUser(state),
  post: state.post,
}))(EditPost);
