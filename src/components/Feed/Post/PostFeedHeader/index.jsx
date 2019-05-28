import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Fragment, useState, memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserCard from '../../../UserCard/UserCard';
import DropdownMenu from '../../../DropdownMenu';
import urls from '../../../../utils/urls';
import { addSuccessNotification } from '../../../../actions/notifications';
import styles from './styles.css';
import OrgIcon from '../../../Icons/Organization.jsx';
import { USER_NEWS_FEED_ID } from '../../../../utils/feed.js';
import { POST_TYPE_MEDIA_ID, POST_TYPE_REPOST_ID, postIsEditable, POST_EDIT_TIME_LIMIT } from '../../../../utils/posts';
import { copyToClipboard } from '../../../../utils/text';

const PostFeedHeader = ({ post, ...props }) => {
  if (!post) {
    return null;
  }

  const [leftTime, setLeftTime] = useState(0);
  const isEditable = postIsEditable(post.createdAt, POST_EDIT_TIME_LIMIT);
  const onClickDropdownButton = () => {
    setLeftTime(15 - moment().diff(post.createdAt, 'm'));
  };

  const items = [post.userId === props.userId ? {
    title: isEditable
      ? <span>Edit <span className={styles.leftTime}>({leftTime} {leftTime <= 1 ? 'minute' : 'minutes'} left)</span></span>
      : <span className={styles.limit}>Can only edit in first 15 min </span>,
    onClick: isEditable ? props.showForm : undefined,
    disabled: !isEditable,
  } : null,
  {
    title: 'Copy Link',
    onClick: () => {
      copyToClipboard(`${document.location.origin}${urls.getFeedPostUrl(post)}`);
      props.addSuccessNotification('Link copied to clipboard');
    },
  }];

  let entityForUser;
  if (props.feedTypeId !== USER_NEWS_FEED_ID) {
    entityForUser = '';
  } else if ((post.userId !== post.entityForCard.id) || (props.user.id !== post.entityForCard.id)) {
    entityForUser = post.entityForCard.accountName;
  } else if (post.post && props.postTypeId === POST_TYPE_REPOST_ID && (post.post.userId !== post.post.entityForCard.id || props.user.id !== post.post.entityForCard.id)) {
    entityForUser = post.post.entityForCard.accountName;
  }

  let entityForOrg;
  if (props.feedTypeId !== USER_NEWS_FEED_ID) {
    entityForOrg = '';
  } else if (post.post && props.postTypeId === POST_TYPE_REPOST_ID) {
    entityForOrg = post.post.entityForCard.title;
  } else {
    entityForOrg = post.entityForCard.title;
  }

  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.info}>
          <Link to={urls.getFeedPostUrl(post)} className={props.formIsVisible ? '' : styles.date}>{props.createdAt}</Link>
          {props.formIsVisible && <span> | <span className={styles.edit}>Edit post</span></span>}
          {entityForUser !== '' && entityForUser !== undefined && post.entityNameFor.trim() === 'users' &&
            <Link to={urls.getUserUrl(post.entityForCard.id)}>@{entityForUser}</Link>
          }
          {entityForOrg !== '' && post.entityNameFor.trim() === 'org' && (
            <Fragment>
              <Link to={urls.getOrganizationUrl(post.entityForCard.id)}>
                {post.entityForCard && post.entityForCard.avatarFilename ? (
                  <img className={styles.orgImg} src={urls.getFileUrl(post.entityForCard.avatarFilename)} alt="img" />
                ) : (
                  <OrgIcon className={styles.orgImg} />
                )}
              </Link>
              <Link to={urls.getOrganizationUrl(post.entityForCard.id)}>@{entityForOrg}</Link>
            </Fragment>
          )}
        </div>
        {!props.formIsVisible &&
          <div className={styles.dropdown}>
            <DropdownMenu
              onClickButton={onClickDropdownButton}
              items={items.filter(e => e)}
              position="bottom-end"
            />
          </div>
        }
      </div>

      {props.userId && POST_TYPE_MEDIA_ID !== props.postTypeId ? (
        <div className={styles.user}>
          <UserCard
            userId={post.userId}
          />
          {/* (entityForOrg !== '' && post.entityNameFor.trim() === 'org' && props.user.organizations.find(x => x.title === post.entityForCard.title) !== undefined) ? (
            <Fragment>
              {post.entityForCard && post.entityForCard.avatarFilename !== null ? (
                <img className={styles.orgImgSmall} src={getFileUrl(post.entityForCard.avatarFilename)} alt="img" />
              ) : (
                <OrgIcon className={styles.orgImgSmall} />
              )}
            </Fragment>
          ) : null */}
        </div>
      ) : null}
    </Fragment>
  );
};

PostFeedHeader.propTypes = {
  createdAt: PropTypes.string.isRequired,
  showForm: PropTypes.func,
  addSuccessNotification: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  formIsVisible: PropTypes.bool,
  userId: PropTypes.number,
  postTypeId: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

PostFeedHeader.defaultProps = {
  userId: null,
  showForm: null,
  formIsVisible: false,
};

export default connect(null, {
  addSuccessNotification,
})(memo(PostFeedHeader, (prev, next) => (
  prev.user.id === next.user.id
)));
