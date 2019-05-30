import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import React, { Fragment, useEffect } from 'react';
import Avatar from '../Avatar';
import Button from '../Button';
import urls from '../../utils/urls';
import { DownvoteIcon, UpvoteIcon, SuccessIcon, ShareIcon, AtIcon } from '../Icons/FeedIcons';
import InputErrorIcon from '../Icons/InputError';
import InputCompleteIcon from '../Icons/InputComplete';
import { getUserName } from '../../utils/user';
import { getFirstImage } from '../../utils/entityImages';
import { getOrganizationUrl } from '../../utils/organization';
import { confirmNotification, declineNotification, seenNotification } from '../../actions/siteNotifications';
import OrganizationIcon from '../Icons/Organization';

import {
  USER_FOLLOWS_YOU,
  USER_UPVOTES_YOUR_POST,
  USER_DOWNVOTES_YOUR_POST,
  USER_UPVOTES_YOUR_COMMENT,
  USER_DOWNVOTES_YOUR_COMMENT,
  USER_FOLLOWS_ORG,
  USER_UPVOTES_ORG_POST,
  USER_DOWNVOTES_ORG_POST,
  USER_UPVOTES_ORG_COMMENT,
  USER_DOWNVOTES_ORG_COMMENT,
  USER_CREATES_DIRECT_POST_FOR_YOU,
  USER_COMMENTS_YOUR_POST,
  USER_LEAVES_COMMENT_ON_YOUR_COMMENT,
  USER_CREATES_DIRECT_POST_FOR_ORG,
  USER_COMMENTS_ORG_POST,
  USER_LEAVES_COMMENT_ON_ORG_COMMENT,
  CONGRATULATIONS_EVENT_ID,
  USER_SHARE_YOUR_POST,
  USER_SHARE_YOUR_MEDIA_POST,
  USER_HAS_MENTIONED_YOU_IN_POST,
  USER_HAS_MENTIONED_YOU_IN_COMMENT,
  USER_TRUST_YOU,
} from '../../store/siteNotifications';

const getAvatarIcon = (eventId) => {
  switch (eventId) {
    case USER_FOLLOWS_ORG:
    case USER_FOLLOWS_YOU:
      return <SuccessIcon />;

    case USER_UPVOTES_ORG_COMMENT:
    case USER_UPVOTES_ORG_POST:
    case USER_UPVOTES_YOUR_COMMENT:
    case USER_UPVOTES_YOUR_POST:
      return <UpvoteIcon />;

    case USER_DOWNVOTES_ORG_COMMENT:
    case USER_DOWNVOTES_ORG_POST:
    case USER_DOWNVOTES_YOUR_COMMENT:
    case USER_DOWNVOTES_YOUR_POST:
      return <DownvoteIcon />;

    case USER_SHARE_YOUR_POST:
    case USER_SHARE_YOUR_MEDIA_POST:
      return <ShareIcon />;
    case USER_HAS_MENTIONED_YOU_IN_POST:
    case USER_HAS_MENTIONED_YOU_IN_COMMENT:
      return <AtIcon />;
    default:
      return null;
  }
};

const getTitle = (props) => {
  if (!props.eventId) return null;

  switch (props.eventId) {
    case USER_TRUST_YOU:
      if (!(props.data && props.data.user)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          &nbsp;trusts you
        </Fragment>
      );

    case USER_FOLLOWS_YOU:
      if (!(props.data && props.data.user)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          &nbsp;started following you
        </Fragment>
      );

    case USER_UPVOTES_YOUR_POST:
    case USER_DOWNVOTES_YOUR_POST:
      if (!(props.data && props.data.user && props.targetEntity && props.targetEntity.post)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          {`${props.eventId === USER_UPVOTES_YOUR_POST ? ' upvotes' : ' downvotes'} your `}
          <Link to={urls.getPostUrl(props.targetEntity.post)}>
            <strong>post</strong>
          </Link>
        </Fragment>
      );
    case USER_SHARE_YOUR_POST:
    case USER_SHARE_YOUR_MEDIA_POST:
      if (!(props.data && props.data.post)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.post.user.id)}>
            <strong>{getUserName(props.data.post.user)}</strong>
          </Link>
          &nbsp;shared your&nbsp;
          <Link to={urls.getPostUrl(props.data.post)}>
            <strong>post</strong>
          </Link>
        </Fragment>
      );
    case USER_DOWNVOTES_YOUR_COMMENT:
    case USER_UPVOTES_YOUR_COMMENT:
      if (!(props.data && props.data.user)) return null;
      if (!(props.targetEntity && props.targetEntity.comment && props.targetEntity.comment.post)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          {`${props.eventId === USER_UPVOTES_YOUR_COMMENT ? ' upvotes' : ' downvotes'} your`}
          <Link to={urls.getPostUrl(props.targetEntity.comment.post)}>
            <strong> comment</strong>
          </Link>
        </Fragment>
      );

    case USER_FOLLOWS_ORG:
      if (!(props.data && props.data.user && props.targetEntity && props.targetEntity.organization)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          &nbsp;joined&nbsp;
          <Link to={getOrganizationUrl(props.targetEntity.organization.id)}>
            <strong>{props.targetEntity.organization.title}</strong>
          </Link>
        </Fragment>
      );

    case USER_DOWNVOTES_ORG_POST:
    case USER_UPVOTES_ORG_POST:
      if (!(props.data && props.data.user && props.targetEntity && props.targetEntity.post)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          {props.eventId === USER_UPVOTES_ORG_POST ? ' upvotes ' : ' downvotes '}
          <Link to={urls.getPostUrl(props.targetEntity.post)}>
            <strong>{props.targetEntity.post.title}</strong>
          </Link>
          &#160;post
        </Fragment>
      );

    case USER_DOWNVOTES_ORG_COMMENT:
    case USER_UPVOTES_ORG_COMMENT:
      if (!(props.data && props.data.user && props.targetEntity && props.targetEntity.organization)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          {props.eventId === USER_UPVOTES_ORG_COMMENT ? ' upvotes ' : ' downvotes '}
          <Link to={getOrganizationUrl(props.targetEntity.comment.organizationId)}>
            <strong>{props.targetEntity.comment.post.title}</strong>
          </Link>
          &#160;comment
        </Fragment>
      );

    case USER_CREATES_DIRECT_POST_FOR_YOU:
      if (!(props.data && props.data.post && props.data.post.user)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.post.user.id)}>
            <strong>{getUserName(props.data.post.user)}</strong>
          </Link>
          &nbsp;posted on your&nbsp;
          <Link to={urls.getPostUrl(props.data.post)}>
            <strong>profile</strong>
          </Link>
        </Fragment>
      );

    case USER_COMMENTS_YOUR_POST:
      if (!(props.data && props.data.comment && props.data.comment.user && props.data.comment.post)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.comment.user.id)}>
            <strong>{getUserName(props.data.comment.user)}</strong>
          </Link>
          &nbsp;commented on your&nbsp;
          <Link to={urls.getPostUrl(props.data.comment.post)}>
            <strong>post</strong>
          </Link>
        </Fragment>
      );

    case USER_LEAVES_COMMENT_ON_YOUR_COMMENT:
      if (!(props.data && props.data.comment && props.data.comment.user && props.data.comment.userId)) return null;
      if (!(props.targetEntity && props.targetEntity.comment && props.targetEntity.comment.post)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.comment.userId)}>
            <strong>{getUserName(props.data.comment.user)}</strong>
          </Link>
          &nbsp;replied to your&nbsp;
          <Link to={urls.getPostUrl(props.targetEntity.comment.post)}>
            <strong>comment</strong>
          </Link>

        </Fragment>
      );

    case USER_CREATES_DIRECT_POST_FOR_ORG:
      if (!(props.data && props.data.post && props.data.post.user && props.targetEntity && props.targetEntity.organization && props.targetEntity.organization.nickname)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.post.user.id)}>
            <strong>{getUserName(props.data.post.user)}</strong>
          </Link>
          &nbsp;posted in&nbsp;
          <Link to={urls.getPostUrl(props.data.post)}>
            <strong>{props.targetEntity.organization.nickname}</strong>
          </Link>
          ’feed
        </Fragment>
      );

    case USER_COMMENTS_ORG_POST:
      if (!(props.data && props.data.user && props.targetEntity.organization)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          &nbsp;commented&nbsp;
          {props.targetEntity.organization.title}
          &#160;post
        </Fragment>
      );

    case USER_LEAVES_COMMENT_ON_ORG_COMMENT:
      if (!(props.data && props.data.user && props.targetEntity.organization)) return null;

      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <strong>{getUserName(props.data.user)}</strong>
          </Link>
          &nbsp;replied to&nbsp;
          {props.targetEntity.organization.title}
          &#160;comment
        </Fragment>
      );

    case CONGRATULATIONS_EVENT_ID:
      if (!(props.data && props.data.user && props.data.organization)) return null;

      return (
        <Fragment>
          {props.data.user && (
            <Fragment>
              <Link to={urls.getUserUrl(props.data.user.id)}>
                <strong>{getUserName(props.data.user)}</strong>
              </Link>
              &nbsp;
            </Fragment>
          )}
          invites you to become a member of&nbsp;
          <Link to={getOrganizationUrl(props.data.organization.id)}>
            <strong>{props.data.organization.title}</strong>
          </Link>
        </Fragment>
      );

    case USER_HAS_MENTIONED_YOU_IN_POST:
      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.post.user.id)}>
            <strong>{getUserName(props.data.post.user)}</strong>
          </Link>
          &nbsp;mentioned you in the &nbsp;
          <Link to={urls.getPostUrl(props.data.post)}>
            <strong>post</strong>
          </Link>
        </Fragment>
      );

    case USER_HAS_MENTIONED_YOU_IN_COMMENT:
      return (
        <Fragment>
          <Link to={urls.getUserUrl(props.data.comment.user.id)}>
            <strong>{getUserName(props.data.comment.user)}</strong>
          </Link>
          &nbsp;mentioned you in the &nbsp;
          <Link to={urls.getPostUrl(props.data.comment.post)}>
            <strong>comment</strong>
          </Link>
        </Fragment>
      );

    default:
      return null;
  }
};

const getCover = (props) => {
  switch (props.eventId) {
    case CONGRATULATIONS_EVENT_ID:
      if (!(props.data && props.data.user && props.data.organization && props.data.organization.avatarFilename)) return null;

      return (
        <div className="site-notification__cover">
          <Link to={getOrganizationUrl(props.data.organization.id)}>
            <Avatar BlankIcon={OrganizationIcon} src={urls.getFileUrl(props.data.organization.avatarFilename)} square />
          </Link>
        </div>
      );

    case USER_CREATES_DIRECT_POST_FOR_YOU:
    case USER_HAS_MENTIONED_YOU_IN_POST:
      if (!(props.data && props.data.post)) return null;

      return (
        <div className="site-notification__cover">
          <Link to={urls.getPostUrl(props.data.post)}>
            <Avatar square isPost src={urls.getFileUrl(getFirstImage(props.data.post))} />
          </Link>
        </div>
      );

    case USER_HAS_MENTIONED_YOU_IN_COMMENT:
      if (!(props.data && props.data.comment)) return null;

      return (
        <div className="site-notification__cover">
          <Link to={urls.getPostUrl(props.data.comment.post)}>
            <Avatar square isPost src={urls.getFileUrl(getFirstImage(props.data.comment.post))} />
          </Link>
        </div>
      );

    case USER_SHARE_YOUR_POST:
    case USER_SHARE_YOUR_MEDIA_POST:
      if (!(props.targetEntity && props.targetEntity.post)) return null;

      return (
        <div className="site-notification__cover">
          <Link to={urls.getPostUrl(props.targetEntity.post)}>
            <Avatar square isPost src={urls.getFileUrl(getFirstImage(props.targetEntity.post))} />
          </Link>
        </div>
      );

    default: {
      if (!props.targetEntity) {
        return null;
      }

      if (props.targetEntity.post) {
        return (
          <div className="site-notification__cover">
            <Link to={urls.getPostUrl(props.targetEntity.post)}>
              <Avatar square isPost src={urls.getFileUrl(getFirstImage(props.targetEntity.post))} />
            </Link>
          </div>
        );
      }

      if (props.targetEntity.organization) {
        return (
          <div className="site-notification__cover">
            <Link to={getOrganizationUrl(props.targetEntity.organization.id)}>
              <Avatar BlankIcon={OrganizationIcon} src={urls.getFileUrl(props.targetEntity.organization.avatarFilename)} square />
            </Link>
          </div>
        );
      }

      return null;
    }
  }
};

const getAvatar = (props) => {
  switch (props.eventId) {
    case USER_CREATES_DIRECT_POST_FOR_ORG:
    case USER_CREATES_DIRECT_POST_FOR_YOU:
    case USER_SHARE_YOUR_POST:
    case USER_SHARE_YOUR_MEDIA_POST:
    case USER_HAS_MENTIONED_YOU_IN_POST:
      if (!(props.data && props.data.post && props.data.post.user)) return null;

      return (
        <div className="site-notification__avatar">
          <Link to={urls.getUserUrl(props.data.post.user.id)}>
            <Avatar
              isPost
              src={urls.getFileUrl(props.data.post.user.avatarFilename)}
              icon={getAvatarIcon(props.eventId)}
            />
          </Link>
        </div>
      );

    case USER_HAS_MENTIONED_YOU_IN_COMMENT:
      if (!(props.data && props.data.comment && props.data.comment.user)) return null;

      return (
        <div className="site-notification__avatar">
          <Link to={urls.getUserUrl(props.data.comment.user.id)}>
            <Avatar
              isPost
              src={urls.getFileUrl(props.data.comment.user.avatarFilename)}
              icon={getAvatarIcon(props.eventId)}
            />
          </Link>
        </div>
      );

    case USER_LEAVES_COMMENT_ON_YOUR_COMMENT:
    case USER_COMMENTS_YOUR_POST:
      if (!(props.data && props.data.comment && props.data.comment.user)) return null;

      return (
        <div className="site-notification__avatar">
          <Link to={urls.getUserUrl(props.data.comment.user.id)}>
            <Avatar src={urls.getFileUrl(props.data.comment.user.avatarFilename)} />
          </Link>
        </div>
      );

    default: {
      return props.data && props.data.user ? (
        <div className="site-notification__avatar">
          <Link to={urls.getUserUrl(props.data.user.id)}>
            <Avatar
              src={urls.getFileUrl(props.data.user.avatarFilename)}
              icon={getAvatarIcon(props.eventId)}
            />
          </Link>
        </div>
      ) : null;
    }
  }
};

const getActions = (props) => {
  switch (props.eventId) {
    case CONGRATULATIONS_EVENT_ID:
      return (
        <div className="site-notification__actions">
          <div className="inline">
            {props.confirmed === 0 ? (
              <Fragment>
                <div className="inline__item">
                  <Button
                    theme="accent-light"
                    size="small"
                    text="Confirm"
                    isStretched
                    onClick={() => props.confirmNotification({
                      id: props.id,
                      idOfOrg: props.data.organization.id,
                    })}
                  />
                </div>

                <div className="inline__item">
                  <Button
                    theme="accent-gray"
                    size="small"
                    text="Decline"
                    isStretched
                    onClick={() => props.declineNotification(props.id)}
                  />
                </div>
              </Fragment>
            ) : (
              <div className="inline__item">
                <div className="site-notification__confirmed-action">
                  <span className="inline inline_small">
                    <span className="inline__item">{props.confirmed === 1 ? 'Accepted' : 'Declined'}</span>
                    <span className="inline__item">
                      {props.confirmed === 1 ? <InputCompleteIcon /> : <InputErrorIcon />}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};

const getContent = (props) => {
  switch (props.eventId) {
    case USER_LEAVES_COMMENT_ON_ORG_COMMENT:
    case USER_COMMENTS_ORG_POST:
    case USER_LEAVES_COMMENT_ON_YOUR_COMMENT:
    case USER_COMMENTS_YOUR_POST:
      if (!(props.data && props.data.comment && props.data.comment.description && props.createdAt)) return null;

      return (
        <div className="site-notification__content">
          <div className="site-notification__title">{getTitle(props)}</div>
          <div className="site-notification__quote">
            <div className="site-notification__comment">{props.data.comment.description}</div>
            {props.createdAt && (
              <div className="site-notification__time">{moment(props.createdAt).fromNow()}</div>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="site-notification__content">
          <div className="site-notification__title">{getTitle(props)}</div>
          {props.createdAt && (
            <div className="site-notification__time">{moment(props.createdAt).fromNow()}</div>
          )}
          {getActions(props)}
        </div>
      );
  }
};

const NotificationCardDefault = (props) => {
  useEffect(() => {
    if (!props.finished) {
      props.seenNotification(props.id);
    }
  }, []);

  return (
    <div className="site-notification">
      {getAvatar(props)}
      {getContent(props)}
      {getCover(props)}
    </div>
  );
};

getContent.propTypes = {
  createdAt: PropTypes.string,
};

getAvatar.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  eventId: PropTypes.number,
};

getCover.propTypes = {
  targetEntity: PropTypes.objectOf(PropTypes.any),
};

NotificationCardDefault.propTypes = {
  id: PropTypes.number,
  seenNotification: PropTypes.func,
};

export default connect(
  null,
  dispatch => bindActionCreators({
    confirmNotification,
    declineNotification,
    seenNotification,
  }, dispatch),
)(NotificationCardDefault);
