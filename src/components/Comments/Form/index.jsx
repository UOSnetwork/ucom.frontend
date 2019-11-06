import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import autosize from 'autosize';
import { last } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect, Fragment } from 'react';
import styles from './styles.css';
import UserPick from '../../UserPick';
import DragAndDrop from '../../DragAndDrop';
import { COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import TributeWrapper from '../../TributeWrapper';
import { isSubmitKey, isEscKey } from '../../../utils/keyboard';
import {
  getGalleryImages,
  addGalleryImagesWithCatch,
  addEmbed as entityImagesAddEmbed,
  removeEmbed as entityImagesRemoveEmbed,
  hasEmbeds as entityImagesHasEmbeds,
} from '../../../utils/entityImages';
import { initDragAndDropListeners } from '../../../utils/dragAndDrop';
import api from '../../../api';
import DropZone from '../../DropZone';
import PreviewImagesGrid from '../../PreviewImagesGrid';
import IconClip from '../../Icons/Clip';
import IconEnter from '../../Icons/Enter';
import Embed from '../../Embed';
import EmbedService from '../../../utils/embedService';
import { getUrlsFromStr, validUrl } from '../../../utils/url';
import withLoader from '../../../utils/withLoader';
import { addNonMultiSignError } from '../../../actions/notifications';

const Form = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(props.message);
  const [entityImages, setEntityImages] = useState(props.entityImages || ({ gallery: [], embeds: [] }));
  const [dropOnForm, setDropOnForm] = useState(false);
  const fieldEl = useRef(null);
  const textareaEl = useRef(null);
  const galleryImages = getGalleryImages({ entityImages });
  const isExistGalleryImages = !!galleryImages.length;
  const addGalleryImages = addGalleryImagesWithCatch(props.onError);
  const [embedUrlsFromMessage, setEmbedUrlsFromMessage] = useState([]);
  const [autosizeInited, setAutosizeInited] = useState(false);

  const initializeAutosize = () => {
    if (!autosizeInited) {
      autosize(textareaEl.current);
      setAutosizeInited(true);
    }
  };

  const postHasContent = () => (
    message.trim().length !== 0 ||
    isExistGalleryImages ||
    entityImagesHasEmbeds(entityImages)
  );

  const reset = () => {
    setMessage('');
    setEntityImages({ gallery: [] });

    if (props.onReset) {
      props.onReset();
    }
  };

  const submit = async () => {
    if (loading || !postHasContent()) {
      return;
    }

    setLoading(true);

    try {
      await props.onSubmit(props.postId, props.commentId, props.containerId, {
        entityImages: JSON.stringify(entityImages),
        description: message,
      });
    } catch (err) {
      setLoading(false);
      return;
    }

    setLoading(false);
    reset();
  };

  const addEmbed = (data) => {
    if (entityImagesHasEmbeds(entityImages)) {
      return;
    }

    setEntityImages(entityImagesAddEmbed(entityImages, data));
  };

  const parseUrlAndAddEmbed = async (url) => {
    if (!validUrl(url)) {
      return;
    }

    try {
      const embedData = await withLoader(EmbedService.getDataFromUrl(url));
      addEmbed(embedData);
    } catch (err) {
      console.error(err);
    }
  };

  const onMultipleImages = async (files) => {
    setLoading(true);
    const savedEntityImages = entityImages;
    setEntityImages(addGalleryImages(entityImages, Array(files.length).fill({ url: '' })));
    const data = await withLoader(Promise.all(files.slice(0, 10 - galleryImages.length).map(url => api.uploadOneImage(url))));
    const urls = data.map(item => item.files[0]);
    setEntityImages(addGalleryImages(savedEntityImages, urls));
    setLoading(false);
  };

  useEffect(() => {
    if (!embedUrlsFromMessage.length) {
      return;
    }

    const url = last(embedUrlsFromMessage);

    parseUrlAndAddEmbed(url);
  }, [embedUrlsFromMessage]);

  useEffect(() => {
    if (textareaEl && textareaEl.current) {
      autosize.update(textareaEl.current);
    }

    if (!message) {
      return;
    }

    const lastUrl = last(getUrlsFromStr(message));

    if (!embedUrlsFromMessage.includes(lastUrl)) {
      setEmbedUrlsFromMessage(embedUrlsFromMessage.concat(lastUrl));
    }
  }, [message]);

  useEffect(() => {
    const removeInitDragAndDropListeners = initDragAndDropListeners(
      fieldEl.current,
      () => setDropOnForm(true),
      () => setDropOnForm(false),
    );

    if (props.autoFocus && textareaEl.current) {
      textareaEl.current.setSelectionRange(message.length, message.length);
    }

    if (props.message) {
      initializeAutosize();
    }

    return () => {
      if (autosizeInited) {
        autosize.destroy(textareaEl);
      }
      removeInitDragAndDropListeners();
    };
  }, []);

  return (
    <div
      className={classNames({
        [styles.form]: true,
        [styles.flat]: props.flat,
      })}
      depth={props.depth}
    >
      {entityImages.embeds && entityImages.embeds.map((embed, index) => (
        <div className="feed-form__embed" key={index}>
          <Embed
            {...embed}
            onClickRemove={() => {
              setEntityImages(entityImagesRemoveEmbed(entityImages, index));
            }}
          />
        </div>
      ))}
      <div className={styles.formMain}>
        <div className={styles.userPick}>
          <UserPick src={props.userImageUrl} url={props.userPageUrl} alt={props.userName} />
        </div>

        <div className={styles.content}>
          <div
            role="presentation"
            ref={fieldEl}
            className={styles.field}
            onClick={() => {
              if (props.disabledForNonMultiOrg) {
                dispatch(addNonMultiSignError());
              }
            }}
          >
            <div className={styles.inputWrapper}>
              <TributeWrapper
                enabledImgUrlParse
                onParseImgUrl={(url) => {
                    setEntityImages(addGalleryImages(entityImages, [{ url }]));
                  }
                }
                onChange={(message) => {
                  setMessage(message);
                  setTimeout(() => autosize.update(textareaEl.current), 0);
                }}
                onImage={url => onMultipleImages([url])}
              >
                <textarea
                  ref={textareaEl}
                  autoFocus={props.autoFocus}
                  rows="1"
                  disabled={loading || props.disabledForNonMultiOrg}
                  className={styles.input}
                  placeholder={t('leaveComment')}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    initializeAutosize();
                    if (isSubmitKey(e)) {
                      submit();
                    } else if (isEscKey(e)) {
                      reset();
                    }
                  }}
                />
              </TributeWrapper>
            </div>

            <div
              className={classNames({
                [styles.containerActions]: true,
                [styles.disabled]: loading,
              })}
            >
              {!props.disabledForNonMultiOrg &&
                <Fragment>
                  <label name="img" className={styles.label}>
                    <IconClip />
                    <DropZone
                      multiple
                      className={styles.labelFile}
                      onDrop={onMultipleImages}
                    />
                  </label>

                  <div
                    role="presentation"
                    className={styles.action}
                    onClick={submit}
                  >
                    <IconEnter />
                  </div>
                </Fragment>
              }
            </div>

            <DragAndDrop
              onMultipleImages={onMultipleImages}
              dropOnForm={dropOnForm}
            />
          </div>
        </div>
      </div>

      <PreviewImagesGrid
        isExistGalleryImages={isExistGalleryImages}
        setEntityImages={setEntityImages}
        entityImages={entityImages}
      />
    </div>
  );
};

Form.propTypes = {
  flat: PropTypes.bool,
  message: PropTypes.string,
  containerId: PropTypes.oneOf([COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST]).isRequired,
  postId: PropTypes.number.isRequired,
  commentId: PropTypes.number,
  depth: PropTypes.number,
  autoFocus: PropTypes.bool,
  userImageUrl: PropTypes.string,
  userPageUrl: PropTypes.string,
  userName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  entityImages: PropTypes.shape({
    gallery: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
    })),
  }),
  onError: PropTypes.func.isRequired,
};

Form.defaultProps = {
  flat: false,
  message: '',
  commentId: null,
  depth: 0,
  autoFocus: false,
  userImageUrl: null,
  userPageUrl: null,
  userName: null,
  onReset: null,
  entityImages: { gallery: [] },
};

export default Form;
