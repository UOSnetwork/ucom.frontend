import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.css';
import { formatRate } from '../../../utils/rate';
import UserPick from '../../UserPick';
import { getUserName } from '../../../utils/user';
import urls from '../../../utils/urls';
import IconComment from '../../Icons/Comment';
import { getCoverImage } from '../../../utils/entityImages';
// import { PostView } from '../../Views';

const Post = ({ post, index }) => {
  const cover = getCoverImage(post);

  return (
    <div
      key={post.id}
      className={classNames({
        [styles.post]: true,
        [styles.withCover]: Boolean(cover),
        [styles.small]: index === 1 || index === 2,
        [styles.medium]: index === 3 || index === 4,
      })}
      data-index={index}
    >
      <div className={styles.inner}>
        <Link className={styles.cover} to={urls.getPostUrl(post)}>
          {cover && <img src={cover} alt="" />}
        </Link>

        <div className={styles.rate}>
          {formatRate(post.currentRate, true)}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <Link to={urls.getPostUrl(post)} className={styles.link}>{post.title}</Link>
          </div>
          <div className={styles.footer}>
            <div className={styles.user}>
              <UserPick
                shadow
                url={urls.getUserUrl(post.user.id)}
                alt={getUserName(post.user)}
                src={urls.getFileUrl(post.user.avatarFilename)}
                size={24}
              />
              <Link to={urls.getUserUrl(post.user.id)} className={styles.link}>
                {getUserName(post.user)}
              </Link>
            </div>

            <div className={styles.data}>
              <span className={styles.count}>
                <IconComment />
                {post.commentsCount}
              </span>

              {/* <PostView postId={post.id} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({

  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Post;
