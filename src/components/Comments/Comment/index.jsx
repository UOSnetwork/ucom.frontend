import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, Fragment } from 'react';
import styles from './styles.css';
import { UserCard } from '../../SimpleCard';
import Gallery from '../../Gallery';
import Form from '../Form';
import ShowReplies from '../ShowReplies';
import { CommentVotingWrapper } from '../../Voting';
import Embed from '../../Embed';
import DropdownMenu from '../../DropdownMenu';
import { COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import { COMMENT_EDIT_TIME_LIMIT } from '../../../utils';
import { sanitizeCommentText, checkMentionTag, checkHashTag } from '../../../utils/text';
import entityIsEditable from '../../../utils/entityIsEditable';
import Command from '../../../utils/command';
import { addNonMultiSignError } from '../../../actions/notifications';

const Comment = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [formVisible, setFormVisible] = useState({ visible: false, name: '' });
  const newReplys = props.replys.filter(i => i.isNew);
  const replys = props.replys.filter(i => newReplys.every(j => j.id !== i.id));

  // TODO: Refactoring (unification with post edit menut)
  const isEditable = entityIsEditable(props.createdAt, COMMENT_EDIT_TIME_LIMIT);
  const calcTimeLeft = () => 15 - moment().diff(props.createdAt, 'm');
  const [leftTime, setLeftTime] = useState(null);

  const menuItems = [];

  if (Command.stringHasTipCommand(props.text)) {
    menuItems.push({
      title: <span className={styles.limit}>{t('tip.canNotEdit')}</span>,
      disabled: true,
    });
  } else {
    menuItems.push({
      title: isEditable ? (
        <span>{t('Edit')} <span className={styles.editLeftTime}>({leftTime} {leftTime <= 1 ? t('minute') : t('minutes')} left)</span></span>
      ) : (
        <span className={styles.limit}>{t('post.canEdit')}</span>
      ),
      onClick: () => isEditable && setEditFormVisible(true),
      disabled: !isEditable,
    });
  }

  return (
    <Fragment>
      {editFormVisible ? (
        <div className={styles.editForm}>
          <Form
            message={props.text}
            containerId={props.containerId}
            postId={props.postId}
            depth={props.depth}
            autoFocus
            userImageUrl={props.ownerImageUrl}
            userPageUrl={props.ownerPageUrl}
            userName={props.ownerName}
            onSubmit={async (postId, parentCommentId, containerId, data) => {
              await props.onUpdate(props.id, data);
            }}
            onReset={() => setEditFormVisible(false)}
            entityImages={props.entityImages}
            onError={props.onError}
          />
        </div>
      ) : (
        <div
          id={`comment-${props.id}`}
          depth={props.depth}
          className={classNames({
            [styles.comment]: true,
            [styles.active]: active,
          })}
        >
          {!props.disabledForNonMultiOrg && props.ownerId === props.userId &&
            <div className={styles.menu}>
              <DropdownMenu
                position="bottom-end"
                onShow={() => {
                  setLeftTime(calcTimeLeft());
                  setActive(true);
                }}
                onHide={() => {
                  setActive(false);
                }}
                items={menuItems}
              />
            </div>
          }
          <div className={styles.userCard}>
            <UserCard
              userId={props.userId}
              isOwner={props.ownerId === props.userId}
            />
          </div>

          <div className={styles.content}>
            {props.entityImages.embeds && props.entityImages.embeds.map((embed, index) => (
              <div className={styles.embed} key={index}>
                <Embed {...embed} />
              </div>
            ))}
            {props.images && props.images.length > 0 &&
              <div className={styles.gallery}>
                <Gallery
                  images={props.images}
                  userId={props.userId}
                  date={props.date}
                />
              </div>
            }

            <div
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html: sanitizeCommentText(checkMentionTag(checkHashTag(props.text))),
              }}
            />

            <div className={styles.actions}>
              <div
                role="presentation"
                className={styles.reply}
                onClick={() => {
                  if (props.disabledForNonMultiOrg) {
                    dispatch(addNonMultiSignError());
                    return;
                  }

                  if (props.depth < 1) {
                    setFormVisible({ visible: true, name: '' });
                  } else if (props.onClickReply) {
                    props.onClickReply();
                  }
                }}
              >
                {t('Reply')}
              </div>
              <div className={styles.date}>{props.date}</div>
              <div className={styles.rating}>
                <CommentVotingWrapper postId={props.postId} commentId={props.id} />
              </div>
            </div>
          </div>
        </div>
      )}

      {replys.map(comment => (
        <Comment
          containerId={props.containerId}
          key={comment.id}
          postId={props.postId}
          id={comment.id}
          depth={comment.depth}
          text={comment.text}
          images={comment.images}
          date={comment.date}
          userId={comment.userId}
          userAccountName={comment.userAccountName}
          replys={comment.replys}
          nextDepthTotalAmount={comment.nextDepthTotalAmount}
          metadata={props.metadata}
          ownerId={props.ownerId}
          ownerImageUrl={props.ownerImageUrl}
          ownerPageUrl={props.ownerPageUrl}
          ownerName={props.ownerName}
          onSubmit={props.onSubmit}
          entityImages={comment.entityImages}
          onClickShowReplies={props.onClickShowReplies}
          onClickReply={() => {
            setFormVisible({ visible: true, name: comment.userAccountName });
          }}
          onError={props.onError}
          onUpdate={props.onUpdate}
          createdAt={comment.createdAt}
        />
      ))}

      {
        ((props.nextDepthTotalAmount > 0 && !props.metadata[props.id]) ||
        (props.metadata[props.id] && props.metadata[props.id].hasMore)) &&
        <ShowReplies
          containerId={props.containerId}
          postId={props.postId}
          parentId={props.id}
          parentDepth={props.depth}
          depth={props.depth}
          onClick={props.onClickShowReplies}
          page={props.metadata[props.id] ? props.metadata[props.id].page + 1 : 1}
        />
      }

      {newReplys.map(comment => (
        <Comment
          containerId={props.containerId}
          key={comment.id}
          postId={props.postId}
          id={comment.id}
          depth={comment.depth}
          text={comment.text}
          images={comment.images}
          date={comment.date}
          userId={comment.userId}
          userAccountName={comment.userAccountName}
          replys={comment.replys}
          nextDepthTotalAmount={comment.nextDepthTotalAmount}
          metadata={props.metadata}
          ownerId={props.ownerId}
          ownerImageUrl={props.ownerImageUrl}
          ownerPageUrl={props.ownerPageUrl}
          ownerName={props.ownerName}
          entityImages={comment.entityImages}
          onSubmit={props.onSubmit}
          onClickShowReplies={props.onClickShowReplies}
          onClickReply={() => {
            setFormVisible({ visible: true, name: comment.userAccountName });
          }}
          onError={props.onError}
          onUpdate={props.onUpdate}
          createdAt={comment.createdAt}
        />
      ))}

      {formVisible && formVisible.visible &&
        <Form
          {...props}
          entityImages={undefined}
          depth={props.depth + 1}
          commentId={props.id}
          autoFocus
          userImageUrl={props.ownerImageUrl}
          userPageUrl={props.ownerPageUrl}
          userName={props.ownerName}
          onReset={() => setFormVisible({ visible: false, name: '' })}
          message={formVisible.visible && formVisible.name !== '' ? `@${formVisible.name} ` : `@${props.userAccountName} `}
          onError={props.onError}
        />
      }
    </Fragment>
  );
};

Comment.propTypes = {
  containerId: PropTypes.oneOf([COMMENTS_CONTAINER_ID_POST, COMMENTS_CONTAINER_ID_FEED_POST]).isRequired,
  id: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    alt: PropTypes.string,
  })),
  nextDepthTotalAmount: PropTypes.number,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  userAccountName: PropTypes.string.isRequired,
  ownerId: PropTypes.number,
  ownerImageUrl: PropTypes.string,
  ownerPageUrl: PropTypes.string,
  ownerName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClickShowReplies: PropTypes.func.isRequired,
  onClickReply: PropTypes.func,
  replys: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    parentId: PropTypes.number.isRequired,
    isNew: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  })),
  metadata: PropTypes.objectOf(PropTypes.shape({
    hasMore: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
  })).isRequired,
  entityImages: PropTypes.objectOf(PropTypes.any),
  onError: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  createdAt: PropTypes.string.isRequired,
};

Comment.defaultProps = {
  images: [],
  replys: [],
  ownerId: null,
  ownerImageUrl: null,
  ownerPageUrl: null,
  ownerName: null,
  nextDepthTotalAmount: 0,
  onClickReply: null,
  entityImages: {},
};

export default Comment;
