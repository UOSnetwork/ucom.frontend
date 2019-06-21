import { last } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../Avatar';
import IconEnter from '../Icons/Enter';
import { selectUser } from '../../store/selectors/user';
import { getUserById } from '../../store/users';
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
import { getUrlsFromStr, validUrl } from '../../utils/url';
import api from '../../api';
import Embed from '../Embed';
import EmbedService from '../../utils/embedService';
import loader from '../../utils/loader';

const FeedForm = (props) => {
  const fieldEl = useRef(null);
  const initialText = props.initialText ? `#${props.initialText} ` : false;
  const user = getUserById(props.users, props.user.id);
  const [message, setMessage] = useState(props.message || initialText || '');
  const [entityImages, setEntityImages] = useState(props.entityImages || {});
  const [dropOnForm, setDropOnForm] = useState(false);
  const [embedUrlsFromMessage, setEmbedUrlsFromMessage] = useState([]);
  const galleryImages = getGalleryImages({ entityImages });
  const isExistGalleryImages = !!galleryImages.length;
  const addGalleryImages = addGalleryImagesWithCatch(props.addErrorNotification);

  const postHasContent = () => (
    message.trim().length !== 0 ||
    isExistGalleryImages ||
    entityImagesHasEmbeds(entityImages)
  );

  const onMultipleImages = async (files) => {
    const savedEntityImages = entityImages;
    setEntityImages(addGalleryImages(entityImages, Array(files.length).fill({ url: '' })));
    const data = await Promise.all(files.slice(0, 10 - galleryImages.length).map(url => api.uploadPostImage(url)));
    const urls = data.map(item => item.files[0]);
    setEntityImages(addGalleryImages(savedEntityImages, urls));
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

    setEntityImages(entityImagesAddEmbed(entityImages, data));
  };

  const parseUrlAndAddEmbed = async (url) => {
    if (!validUrl(url)) {
      return;
    }

    loader.start();
    try {
      const embedData = await EmbedService.getDataFromUrl(url);
      addEmbed(embedData);
    } catch (err) {
      console.error(err);
    }
    loader.done();
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

    return () => {
      removeInitDragAndDropListeners();
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
        sumbitForm();
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
              onChange={message => setMessage(message)}
              onImage={url => onMultipleImages([url])}
              onParseImgUrl={(url) => {
                setEntityImages(addGalleryImages(entityImages, [{ url }]));
              }}
            >
              <textarea
                autoFocus
                rows="4"
                className="feed-form__textarea"
                placeholder="Leave a comment"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey && e.keyCode === 13) || (e.metaKey && e.keyCode === 13)) {
                    e.preventDefault();
                    sumbitForm();
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
        />
        <button
          type="submit"
          className="feed-form__submit"
          disabled={message.trim().length === 0 && !isExistGalleryImages && !entityImagesHasEmbeds(entityImages)}
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
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  message: PropTypes.string,
  entityImages: PropTypes.objectOf(PropTypes.array),
  initialText: PropTypes.string,
  formIsVisible: PropTypes.bool,
};

FeedForm.defaultProps = {
  message: '',
  initialText: '',
  entityImages: null,
  formIsVisible: false,
};

export default connect(state => ({
  users: state.users,
  user: selectUser(state),
}), {
  addErrorNotification,
})(FeedForm);
