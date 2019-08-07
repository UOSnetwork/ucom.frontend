import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutBase, Content } from '../../components/Layout';
import ButtonEdit from '../../components/ButtonEdit';
import PostContent from '../../components/Post/Content';
import PostRating from '../../components/Rating/PostRating';
import Comments from '../../components/Comments/wrapper';
import Share from '../../components/Share';
import Footer from '../../components/Footer';
import { UserSubHeader } from '../../components/EntrySubHeader';
import Button from '../../components/Button/index';
import { postsFetch } from '../../actions/posts';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import { commentsResetContainerDataByEntryId } from '../../actions/comments';
import { COMMENTS_CONTAINER_ID_POST } from '../../utils/comments';
import urls from '../../utils/urls';
import { POST_TYPE_MEDIA_ID } from '../../utils/posts';
import withLoader from '../../utils/withLoader';
import { formatRate } from '../../utils/rate';
import { selectPostById, selectOwner } from '../../store/selectors';
import styles from './styles.css';

const Post = ({ postId }) => {
  const dispatch = useDispatch();
  const post = useSelector(selectPostById(postId));
  const owner = useSelector(selectOwner);

  const getData = async () => {
    dispatch(commentsResetContainerDataByEntryId({
      containerId: COMMENTS_CONTAINER_ID_POST,
      entryId: postId,
    }));

    try {
      await withLoader(dispatch(postsFetch({ postId })));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  useEffect(() => {
    getData();
  }, [postId]);

  return (
    <LayoutBase>
      <Content>
        <div className={styles.wrapper}>
          {post && post.user && <UserSubHeader userId={post.user.id} />}

          {post &&
            <div className={styles.content}>
              <div className={styles.inner}>
                <div className={styles.aside}>
                  {post.user && post.user.id === owner.id &&
                    <ButtonEdit url={urls.getPostEditUrl(postId)} />
                  }
                </div>

                <div className={styles.bside}>
                  <div className={styles.actions}>
                    <div className={styles.rate}>
                      <div className={styles.value}>
                        {formatRate(post.currentRate, true)}
                      </div>
                      <div className={styles.label}>
                        Rate
                      </div>
                    </div>
                    <div className={styles.rating}>
                      <PostRating postId={+postId} />
                    </div>
                    <div className={styles.share}>
                      <Share
                        socialEnable
                        repostEnable={post.myselfData && post.myselfData.repostAvailable}
                        postId={postId}
                        link={urls.getPostUrl({ id: postId, postTypeId: POST_TYPE_MEDIA_ID })}
                      >
                        <Button strech>Share</Button>
                      </Share>
                    </div>
                  </div>
                </div>

                <div className={styles.main}>
                  <div className={styles.post}>
                    <PostContent post={post} />
                  </div>
                  <div className={styles.comments}>
                    <Comments postId={+postId} containerId={COMMENTS_CONTAINER_ID_POST} />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <Footer />
      </Content>
    </LayoutBase>
  );
};

Post.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export * from './wrappers';
export default Post;
