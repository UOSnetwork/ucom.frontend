// TODO: Refactoring and refactoring tribute wrapper
import { useTranslation } from 'react-i18next';
import autosize from 'autosize';
import { last } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../Avatar';
import IconEnter from '../Icons/Enter';
import { selectOwner } from '../../store/selectors';
import { addErrorNotification } from '../../actions/notifications';
import { initDragAndDropListeners } from '../../utils/dragAndDrop';
import {
  getGalleryImages,
  addGalleryImagesWithCatch,
  addEmbed as entityImagesAddEmbed,
  removeEmbed as entityImagesRemoveEmbed,
  hasEmbeds as entityImagesHasEmbeds,
} from '../../utils/entityImages';
import TributeWrapper from '../TributeWrapper';
import EmbedMenu from './Post/EmbedMenu';
import DragAndDrop from '../DragAndDrop';
import PreviewImagesGrid from '../PreviewImagesGrid';
import urls from '../../utils/urls';
import { getUrlsFromStr, validUrl, validImageUrl } from '../../utils/url';
import api from '../../api';
import Embed from '../Embed';
import EmbedService from '../../utils/embedService';
import withLoader from '../../utils/withLoader';

const FeedForm = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const fieldEl = useRef(null);
  const initialText = props.initialText ? `#${props.initialText} ` : false;
  const user = useSelector(selectOwner);
  const [message, setMessage] = useState(props.message || initialText || '');
  const [entityImages, setEntityImages] = useState(props.entityImages || {});
  const [dropOnForm, setDropOnForm] = useState(false);
  const [embedUrlsFromMessage, setEmbedUrlsFromMessage] = useState([]);
  const galleryImages = getGalleryImages({ entityImages });
  const isExistGalleryImages = !!galleryImages.length;
  const textareaEl = useRef(null);

  const addGalleryImages = addGalleryImagesWithCatch((msg) => {
    dispatch(addErrorNotification(msg));
  });

  const postHasContent = () => (
    message.trim().length !== 0 ||
    isExistGalleryImages ||
    entityImagesHasEmbeds(entityImages)
  );

  const onMultipleImages = async (files) => {
    setLoading(true);

    const savedEntityImages = entityImages;
    setEntityImages(addGalleryImages(entityImages, Array(files.length).fill({ url: '' })));
    const data = await Promise.all(files.slice(0, 10 - galleryImages.length).map(url => api.uploadOneImage(url)));
    const urls = data.map(item => item.files[0]);
    const newEntityImages = addGalleryImages(savedEntityImages, urls);
    setEntityImages(newEntityImages);

    setLoading(false);

    if (props.onEntityImages) {
      props.onEntityImages(newEntityImages);
    }
  };

  const sumbitForm = () => {
    if (postHasContent()) {
      props.onSubmit(message, JSON.stringify(entityImages));
    }
  };

  const addEmbed = (data) => {
    if (entityImagesHasEmbeds(entityImages)) {
      return;
    }

    const newEntityImages = entityImagesAddEmbed(entityImages, data);
    setEntityImages(newEntityImages);

    if (props.onEntityImages) {
      props.onEntityImages(newEntityImages);
    }
  };

  const parseUrlAndAddEmbed = async (url) => {
    if (!validUrl(url) || validImageUrl(url)) {
      return;
    }

    setLoading(true);

    try {
      const embedData = await withLoader(EmbedService.getDataFromUrl(url));
      addEmbed(embedData);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const onEdit = (message) => {
    setMessage(message);

    if (props.onMessage) {
      props.onMessage(message);
    }
  };

  useEffect(() => {
    if (!embedUrlsFromMessage.length) {
      return;
    }

    const url = last(embedUrlsFromMessage);

    parseUrlAndAddEmbed(url);
  }, [embedUrlsFromMessage]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const lastUrl = last(getUrlsFromStr(message));

    if (!embedUrlsFromMessage.includes(lastUrl)) {
      setEmbedUrlsFromMessage(embedUrlsFromMessage.concat(lastUrl));
    }

    autosize.update(textareaEl.current);
  }, [message]);

  useEffect(() => {
    const removeInitDragAndDropListeners = initDragAndDropListeners(
      fieldEl.current,
      () => {
        setDropOnForm(true);
      },
      () => {
        setDropOnForm(false);
      },
    );

    autosize(textareaEl.current);

    return () => {
      removeInitDragAndDropListeners();

      autosize.destroy(textareaEl.current);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <form
      className={classNames({
        'feed-form': true,
        'feed-form__edit': props.formIsVisible,
      })}
      onSubmit={(e) => {
        e.preventDefault();

        if (!loading && !props.loading) {
          sumbitForm();
        }
      }}
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

      <div className="feed-form__field">
        {!props.formIsVisible &&
          <div className="feed-form__avatar">
            <Avatar src={urls.getFileUrl(user.avatarFilename)} />
          </div>
        }

        <div
          ref={fieldEl}
          className={classNames({
            'feed-form-message': true,
            'feed-form-message__edit': props.formIsVisible,
          })}
        >
          <div className="feed-form__container">
            <TributeWrapper
              enabledImgUrlParse
              onChange={onEdit}
              onImage={url => onMultipleImages([url])}
              onParseImgUrl={(url) => {
                setEntityImages(addGalleryImages(entityImages, [{ url }]));
              }}
            >
              <textarea
                autoFocus
                ref={textareaEl}
                rows="4"
                className="feed-form__textarea"
                placeholder={t('leaveComment')}
                value={message}
                onChange={e => onEdit(e.target.value)}
                disabled={loading || props.loading}
                onKeyDown={(e) => {
                  if ((e.ctrlKey && e.keyCode === 13) || (e.metaKey && e.keyCode === 13)) {
                    e.preventDefault();

                    if (!loading && !props.loading) {
                      sumbitForm();
                    }
                  }

                  if (e.keyCode === 27) {
                    e.preventDefault();
                    props.onCancel();
                  }
                }}
              />
            </TributeWrapper>
            <DragAndDrop {...{
                onMultipleImages, dropOnForm,
              }}
            />
          </div>
        </div>
      </div>

      <PreviewImagesGrid
        {...{
          isExistGalleryImages, setEntityImages, entityImages,
        }}
      />

      <div className="feed-form__actions">
        <EmbedMenu
          onImage={onMultipleImages}
          onEmbed={addEmbed}
          disabledEmbed={entityImagesHasEmbeds(entityImages)}
          disabled={loading || props.loading}
        />
        <button
          type="submit"
          className="feed-form__submit"
          disabled={(message.trim().length === 0 && !isExistGalleryImages && !entityImagesHasEmbeds(entityImages)) || loading || props.loading}
        >
          <IconEnter />
        </button>
      </div>
    </form>
  );
};

FeedForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onMessage: PropTypes.func,
  message: PropTypes.string,
  entityImages: PropTypes.objectOf(PropTypes.array),
  initialText: PropTypes.string,
  formIsVisible: PropTypes.bool,
  onEntityImages: PropTypes.func,
  loading: PropTypes.bool,
};

FeedForm.defaultProps = {
  message: '',
  initialText: '',
  entityImages: null,
  formIsVisible: false,
  onMessage: undefined,
  onEntityImages: undefined,
  loading: false,
};

export default FeedForm;
