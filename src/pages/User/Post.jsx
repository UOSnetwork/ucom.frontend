import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, memo } from 'react';
import Popup from '../../components/Popup';
import ModalContent from '../../components/ModalContent';
import Post from '../../components/Feed/Post/Post';
import { selectUserById, selectPostById } from '../../store/selectors';
import { COMMENTS_CONTAINER_ID_POST } from '../../utils/comments';
import urls from '../../utils/urls';
import withLoader from '../../utils/withLoader';
import { postsFetch } from '../../actions/posts';
import { addErrorNotificationFromResponse } from '../../actions/notifications';

const PostPopup = ({ history, match }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserById(match.params.userId), isEqual);
  const post = useSelector(selectPostById(match.params.postId), isEqual);

  const fetchData = async () => {
    try {
      await withLoader(dispatch(postsFetch({
        postId: match.params.postId,
      })));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
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
          headerColor="#fff"
        />
      </ModalContent>
    </Popup>
  );
};

export default memo(PostPopup);
