import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import Popup from '../../components/Popup';
import ModalContent from '../../components/ModalContent';
import Post from '../../components/Feed/Post/Post';
import { getPostById } from '../../store/posts';
import { getUserById } from '../../store/users';
import { COMMENTS_CONTAINER_ID_POST } from '../../utils/comments';
import urls from '../../utils/urls';
import withLoader from '../../utils/withLoader';
import { postsFetch } from '../../actions/posts';
import { addErrorNotification } from '../../actions/notifications';

const PostPopup = ({
  post, user, history, match, postsFetch, addErrorNotification,
}) => {
  const fetchData = async () => {
    try {
      await withLoader(postsFetch({
        postId: match.params.postId,
      }));
    } catch (err) {
      addErrorNotification(err.message);
    }
  };

  const redirectToUserPage = () => {
    history.push(urls.getUserUrl(user.id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!post || !user) {
    return null;
  }

  return (
    <Popup onClickClose={redirectToUserPage}>
      <ModalContent mod="post">
        <Post
          id={post.id}
          postTypeId={post.postTypeId}
          commentsContainerId={COMMENTS_CONTAINER_ID_POST}
        />
      </ModalContent>
    </Popup>
  );
};

PostPopup.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    postTypeId: PropTypes.number.isRequired,
  }),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  postsFetch: PropTypes.func.isRequired,
  addErrorNotification: PropTypes.func.isRequired,
};

PostPopup.defaultProps = {
  post: undefined,
  user: undefined,
};

export default connect((state, props) => ({
  post: getPostById(state.posts, props.match.params.postId),
  user: getUserById(state.users, props.match.params.userId),
}), {
  postsFetch,
  addErrorNotification,
})(PostPopup);
