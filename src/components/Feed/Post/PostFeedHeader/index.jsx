import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Fragment, useState, memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { UserCard } from '../../../SimpleCard';
import DropdownMenu from '../../../DropdownMenu';
import urls from '../../../../utils/urls';
import { addSuccessNotification } from '../../../../actions/notifications';
import styles from './styles.css';
import UserPick from '../../../UserPick/UserPick';
import { POST_TYPE_MEDIA_ID, POST_TYPE_REPOST_ID, postIsEditable, POST_EDIT_TIME_LIMIT } from '../../../../utils/posts';
import { copyToClipboard } from '../../../../utils/text';
import fromNow from '../../../../utils/fromNow';

const PostFeedHeader = ({ post, ...props }) => {
  if (!post) {
    return null;
  }

  const [leftTime, setLeftTime] = useState(0);

  const onClickDropdownButton = () => {
    setLeftTime(15 - moment().diff(post.createdAt, 'm'));
  };

  const items = [{
    title: 'Copy Link',
    onClick: () => {
      copyToClipboard(`${document.location.origin}${urls.getFeedPostUrl(post)}`);
      props.addSuccessNotification('Link copied to clipboard');
    },
  }];

  if (props.user && props.user.id === post.userId && post.postTypeId !== POST_TYPE_REPOST_ID) {
    const isEditable = postIsEditable(post.createdAt, POST_EDIT_TIME_LIMIT);

    items.unshift({
      title: isEditable ? (
        <span>Edit <span className={styles.leftTime}>({leftTime} {leftTime <= 1 ? 'minute' : 'minutes'} left)</span></span>
      ) : (
        <span className={styles.limit}>Can only edit in first 15 min </span>
      ),
      onClick: isEditable ? props.showForm : undefined,
      disabled: !isEditable,
    });
  }

  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.info}>
          <Link to={urls.getFeedPostUrl(post)}>{fromNow(post.createdAt)}</Link>

          {props.originEnabled &&
            <Fragment>
              {post.entityNameFor.trim() === 'org' &&
                <div className={styles.org}>
                  <UserPick
                    shadow
                    size={24}
                    organization
                    url={urls.getOrganizationUrl(post.entityForCard.id)}
                    src={urls.getFileUrl(post.entityForCard.avatarFilename)}
                    alt={post.entityForCard.title}
                  />
                  <Link to={urls.getOrganizationUrl(post.entityForCard.id)}>{post.entityForCard.title}</Link>
                </div>
              }

              {post.entityNameFor.trim() === 'users' &&
                <span>
                  <Link to={urls.getUserUrl(post.entityForCard.id)}>@{post.entityForCard.accountName}</Link>
                </span>
              }
            </Fragment>
          }
        </div>

        {!props.formIsVisible &&
          <div className={styles.dropdown}>
            <DropdownMenu
              items={items}
              position="bottom-end"
              onClickButton={onClickDropdownButton}
            />
          </div>
        }
      </div>

      {post.postTypeId !== POST_TYPE_MEDIA_ID &&
        <div className={styles.user}>
          <UserCard userId={post.userId} />
        </div>
      }
    </Fragment>
  );
};

PostFeedHeader.propTypes = {
  originEnabled: PropTypes.bool,
  showForm: PropTypes.func,
  addSuccessNotification: PropTypes.func.isRequired,
  formIsVisible: PropTypes.bool,
  userId: PropTypes.number,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

PostFeedHeader.defaultProps = {
  originEnabled: true,
  userId: null,
  showForm: null,
  formIsVisible: false,
};

export default connect(null, {
  addSuccessNotification,
})(memo(PostFeedHeader, (prev, next) => (
  prev.user.id === next.user.id
)));
