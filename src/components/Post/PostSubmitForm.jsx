import { connect } from 'react-redux';
import React, { Fragment, useState } from 'react';
import TextareaAutosize from '../TextareaAutosize';
import Button from '../Button';
import { setDataToStoreToLS } from '../../actions';
import { UPLOAD_SIZE_LIMIT, UPLOAD_SIZE_LIMIT_ERROR, compressUploadedImage } from '../../utils/upload';
import { changeCoverImageUrl } from '../../utils/entityImages';
import { addErrorNotification } from '../../actions/notifications';
import api from '../../api';
import loader from '../../utils/loader';
import { POSTS_TITLE_MAX_LENGTH, POSTS_LEADING_TEXT_MAX_LENGTH } from '../../utils/posts';
import CreateBy from '../../pages/EditPost/CreateBy';


const PostSubmitForm = (props) => {
  const entityImages = props.post.data.entityImages || {};
  const [loadingCover, setLoadingCover] = useState(false);

  return (
    <div className="post-submit-form">
      <div className="post-submit-form__title">
        <h3 className="title title_small">Publication preview</h3>
      </div>

      <div className="post-submit-cover">
        <label className="post-submit-cover__inner">
          {entityImages.articleTitle && entityImages.articleTitle[0] ? (
            <Fragment>
              <img className="post-submit-cover__img" src={entityImages.articleTitle[0].url} alt="" />
              <div className="post-submit-cover__change">Click to change preview image</div>
            </Fragment>
          ) : (
            <div className="post-submit-cover__text">Click to upload preview image</div>
          )}

          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0];

              if (!file || !file.type.indexOf('image/') === 0) {
                return;
              }

              if (file.size > UPLOAD_SIZE_LIMIT) {
                props.addErrorNotification(UPLOAD_SIZE_LIMIT_ERROR);
                return;
              }

              loader.start();
              setLoadingCover(true);

              try {
                const data = await api.uploadOneImage(await compressUploadedImage(file));
                const { url } = data.files[0];
                props.setDataToStoreToLS({ entityImages: changeCoverImageUrl(entityImages, url) });
              } catch (e) {
                console.error(e);
              }

              loader.done();
              setLoadingCover(false);
            }}
          />
        </label>
      </div>

      <div className="post-submit-form__field">
        <TextareaAutosize
          rows="1"
          maxLength={POSTS_TITLE_MAX_LENGTH}
          placeholder="Preview title"
          className="post-submit-form__data post-submit-form__data_title"
          value={props.post.data.title}
          onChange={title => props.setDataToStoreToLS({ title })}
        />
      </div>

      <div className="post-submit-form__field">
        <TextareaAutosize
          rows="1"
          maxLength={POSTS_LEADING_TEXT_MAX_LENGTH}
          placeholder="Preview description"
          className="post-submit-form__data post-submit-form__data_lead"
          value={props.post.data.leadingText}
          onChange={leadingText => props.setDataToStoreToLS({ leadingText })}
        />
      </div>

      <div className="post-submit-form__action">
        <div>
          <CreateBy />
        </div>

        <Button
          theme="red"
          size="small"
          text="Publish"
          isDisabled={!props.post.isValid || loadingCover || props.loading}
          onClick={() => props.onSubmit && props.onSubmit()}
        />
      </div>
    </div>
  );
};

export default connect(state => ({
  post: state.post,
}), {
  setDataToStoreToLS,
  addErrorNotification,
})(PostSubmitForm);
