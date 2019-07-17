import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { sanitizePostText, checkHashTag, checkMentionTag } from '../../utils/text';
import { getPostBody } from '../../utils/posts';
import EmbedService from '../../utils/embedService';

const PostContent = ({ post }) => {
  const el = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (el.current) {
        EmbedService.renderEmbeds(el.current, post.entityImages);
      }
    }, 0);
  }, [post]);

  return (
    <div
      ref={el}
      className="post-content"
      dangerouslySetInnerHTML={{
        __html: sanitizePostText(checkMentionTag(checkHashTag(getPostBody(post)))),
      }}
    />
  );
};

PostContent.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PostContent;
