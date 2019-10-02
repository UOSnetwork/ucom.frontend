import moment from 'moment';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutBase, Content } from '../../components/Layout';
import ButtonEdit from '../../components/ButtonEdit';
import PostContent from './Content';
import { PostVoting } from '../../components/Voting';
import Comments from '../../components/Comments/wrapper';
import Share from '../../components/Share';
import Footer from '../../components/Footer';
import { UserSubHeader, OrgSubHeader } from '../../components/EntrySubHeader';
import { postsFetch } from '../../actions/posts';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import { commentsResetContainerDataByEntryId } from '../../actions/comments';
import { COMMENTS_CONTAINER_ID_POST } from '../../utils/comments';
import urls from '../../utils/urls';
import { POST_TYPE_MEDIA_ID } from '../../utils';
import withLoader from '../../utils/withLoader';
import { formatRate } from '../../utils/rate';
import { UserCard } from '../../components/SimpleCard';
import { UserFollowButton } from '../../components/FollowButton';
import { selectPostById, selectOwner } from '../../store/selectors';
import { PostView } from '../../components/Views';
import { PostTags } from '../../components/Tags';
import styles from './styles.css';

const Post = ({ postId }) => {
  const dispatch = useDispatch();
  const post = useSelector(selectPostById(postId), isEqual);
  const owner = useSelector(selectOwner);

  const createdAt = useMemo(() => {
    if (!post || !post.createdAt) {
      return '';
    }

    return moment(post.createdAt).format('MMMM D, YYYY');
  }, [post]);

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
          {post &&
            <Fragment>
              {post.organizationId ? (
                <OrgSubHeader orgId={post.organizationId} label={createdAt} />
              ) : (
                <UserSubHeader userId={post.userId} label={createdAt} />
              )}
            </Fragment>
          }

          {post &&
            <div className={styles.content}>
              <div className={styles.section}>
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
                        <PostVoting postId={+postId} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.main}>
                    <PostContent postId={+postId} />

                    <PostTags postId={+postId} />

                    {post && post.userId &&
                      <div className={styles.user}>
                        <UserCard userId={post.userId} />

                        {owner.id !== post.userId &&
                          <UserFollowButton userId={post.userId} />
                        }
                      </div>
                    }

                    <div className={styles.stats}>
                      <Share
                        postId={postId}
                        link={urls.getPostUrl({ id: postId, postTypeId: POST_TYPE_MEDIA_ID })}
                      />

                      <PostView postId={+postId} />
                    </div>
                  </div>
                </div>
              </div>

              <hr className={styles.line} />

              <div className={styles.section}>
                <div className={styles.inner}>
                  <div className={styles.main}>
                    <div className={styles.comments}>
                      <Comments postId={+postId} containerId={COMMENTS_CONTAINER_ID_POST} />
                    </div>
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
