import { isEqual } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { Fragment, useEffect, useRef, memo, useState, useCallback } from 'react';
import { sanitizePostText, checkHashTag, checkMentionTag } from '../../../utils/text';
import { getPostBody, getPostImages } from '../../../utils/posts';
import { GalleryPopup } from '../../../components/Gallery';
import EmbedService from '../../../utils/embedService';
import { selectPostById } from '../../../store/selectors';

const PostContent = ({ postId }) => {
  const post = useSelector(selectPostById(postId), isEqual);
  const [galleryPopupVisible, setGalleryPopupVisible] = useState(false);
  const [galleryPopupIndex, setGalleryPopupIndex] = useState(0);
  const postImagesUrls = getPostImages(post.description);
  const el = useRef(null);

  const onClickImg = useCallback((e) => {
    if (e.target.tagName.toLowerCase() === 'img') {
      const postImagesUrlsIndex = postImagesUrls.indexOf(e.target.src);

      if (postImagesUrlsIndex === -1) {
        return;
      }

      setGalleryPopupIndex(postImagesUrlsIndex);
      setGalleryPopupVisible(true);
    }
  }, [postImagesUrls]);

  useEffect(() => {
    setTimeout(() => {
      if (el.current) {
        EmbedService.renderEmbeds(el.current, post.entityImages);
      }
    }, 0);
  }, [post.entityImages]);

  useEffect(() => {
    el.current.addEventListener('click', onClickImg);

    return () => {
      el.current.removeEventListener('click', onClickImg);
    };
  }, [postImagesUrls]);

  if (!post) {
    return null;
  }

  return (
    <Fragment>
      {galleryPopupVisible &&
        <GalleryPopup
          userId={post.userId}
          index={galleryPopupIndex}
          date={moment(post.createdAt).fromNow()}
          images={postImagesUrls.map(url => ({ url }))}
          onClickClose={() => setGalleryPopupVisible(false)}
        />
      }

      <div
        ref={el}
        className="post-content"
        dangerouslySetInnerHTML={{
          __html: sanitizePostText(checkMentionTag(checkHashTag(getPostBody(post)))),
        }}
      />
    </Fragment>
  );
};

PostContent.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default memo(PostContent);
