import { Trans, useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Fragment, useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { UserCard } from '../../../SimpleCard';
import DropdownMenu from '../../../DropdownMenu';
import urls from '../../../../utils/urls';
import utilsActions from '../../../../actions/utils';
import styles from './styles.css';
import UserPick from '../../../UserPick';
import entityIsEditable from '../../../../utils/entityIsEditable';
import { POST_TYPE_MEDIA_ID, POST_TYPE_REPOST_ID, POST_EDIT_TIME_LIMIT } from '../../../../utils';
import fromNow from '../../../../utils/fromNow';
import { selectPostById, selectOwner } from '../../../../store';

const PostFeedHeader = ({
  postId, onClickEdit, originEnabled, menuVisible,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const post = useSelector(selectPostById(postId), isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const calcTimeLeft = () => 15 - moment().diff(post.createdAt, 'm');
  const [leftTime, setLeftTime] = useState(calcTimeLeft());

  if (!post) {
    return null;
  }

  const copyLink = useCallback(
    () => {
      dispatch(utilsActions.copyToClipboard(`${document.location.origin}${urls.getFeedPostUrl(post)}`));
    },
    [dispatch, post],
  );

  const items = [{
    title: t('Copy Link'),
    onClick: copyLink,
  }];

  if (owner && owner.id === post.userId && post.postTypeId !== POST_TYPE_REPOST_ID && post.postTypeId !== POST_TYPE_MEDIA_ID) {
    const isEditable = entityIsEditable(post.createdAt, POST_EDIT_TIME_LIMIT);

    // TODO: Refactoring (unification with comment edit menut)
    items.unshift({
      title: isEditable ? (
        <span>
          <Trans i18nKey="Edit left" count={leftTime} label={leftTime <= 1 ? 'minute' : 'minutes'}>
            Edit <span className={styles.leftTime}>({{ count: leftTime }} {{ label: leftTime <= 1 ? 'minute' : 'minutes' }} left)</span>
          </Trans>
        </span>
      ) : (
        <span className={styles.limit}>{t('post.canEdit')}</span>
      ),
      onClick: isEditable ? onClickEdit : undefined,
      disabled: !isEditable,
    });
  }

  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.info}>
          <Link to={urls.getFeedPostUrl(post)}>{fromNow(post.createdAt)}</Link>

          {originEnabled &&
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

        {menuVisible &&
          <div className={styles.dropdown}>
            <DropdownMenu
              items={items}
              position="bottom-end"
              onHidden={() => setLeftTime(calcTimeLeft())}
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
  postId: PropTypes.number.isRequired,
  onClickEdit: PropTypes.func,
  menuVisible: PropTypes.bool,
};

PostFeedHeader.defaultProps = {
  originEnabled: true,
  menuVisible: true,
  onClickEdit: undefined,
};

export default memo(PostFeedHeader);
