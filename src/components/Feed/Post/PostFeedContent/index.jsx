import { useTranslation } from 'react-i18next';
import React, { Fragment, memo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import FeedForm from '../../FeedForm';
import Gallery from '../../../Gallery';
import { upadteDirectPost } from '../../../../actions/posts';
import DescDirectPost from './DescDirectPost';
import { checkMentionTag } from '../../../../utils/text';
import styles from './styles.css';
import urls from '../../../../utils/urls';
import { getCoverImage } from '../../../../utils/entityImages';
import Embed from '../../../Embed';
import { POST_TYPE_DIRECT_ID } from '../../../../utils';
import equalByProps from '../../../../utils/equalByProps';
import { getSocialKey } from '../../../../utils/keys';
import { addErrorNotificationFromResponse } from '../../../../actions/notifications';
import { authShowPopup } from '../../../../actions/auth';
import { selectOwner, selectUserById, selectOrgById } from '../../../../store/selectors';
import withLoader from '../../../../utils/withLoader';

const PostFeedContent = ({
  post, forUserId, forOrgId, ...props
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, equalByProps('id', 'accountName'));
  const forUser = useSelector(selectUserById(forUserId), equalByProps('accountName'));
  const forOrg = useSelector(selectOrgById(forOrgId), equalByProps('blockchainId'));

  if (!post) {
    return null;
  }

  const onSubmit = async (description, entityImages) => {
    if (loading) {
      return;
    }

    const ownerPrivateKey = getSocialKey();

    if (!owner.id || !owner.accountName || !ownerPrivateKey) {
      dispatch(authShowPopup());
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch(upadteDirectPost(
        owner.accountName,
        ownerPrivateKey,
        post.blockchainId,
        forUser && forUser.accountName,
        post.id,
        forOrg && forOrg.id,
        forOrg && forOrg.blockchainId,
        {
          description,
          entityImages,
          postTypeId: post.postTypeId,
          createdAt: post.createdAt,
        },
      )));
      props.hideForm();
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    setLoading(false);
  };

  return props.formIsVisible ? (
    <div className={styles.form}>
      <FeedForm
        loading={loading}
        message={post.description}
        entityImages={post.entityImages}
        onCancel={props.hideForm}
        formIsVisible={props.formIsVisible}
        onSubmit={onSubmit}
      />
    </div>
  ) : (
    <Fragment>
      {post.entityImages.embeds && post.entityImages.embeds.map((embed, index) => (
        <div className={styles.embed} key={index}>
          <Embed {...embed} />
        </div>
      ))}

      {(props.postTypeId === POST_TYPE_DIRECT_ID || post.postTypeId === POST_TYPE_DIRECT_ID) && !props.formIsVisible ? (
        <Fragment>
          {getCoverImage(post) ? (
            <div className={styles.cover}>
              <img src={urls.getFileUrl(getCoverImage(post))} alt={t('cover')} />
            </div>
          ) : post.entityImages.gallery && post.entityImages.gallery.length > 0 &&
            <div className={styles.gallery}>
              <Gallery
                images={post.entityImages.gallery}
                userId={post.userId}
                date={moment(post.createdAt).fromNow()}
              />
            </div>
          }

          {post.description &&
            <div className={styles.content}>
              <DescDirectPost
                desc={checkMentionTag(post.description)}
                limit={100}
              />
            </div>
          }
        </Fragment>
      ) : (
        null
      )}
    </Fragment>
  );
};

PostFeedContent.propTypes = {
  postId: PropTypes.number.isRequired,
  formIsVisible: PropTypes.bool.isRequired,
  updatePost: PropTypes.func.isRequired,
  postTypeId: PropTypes.number.isRequired,
  hideForm: PropTypes.func.isRequired,
};

export default memo(PostFeedContent, equalByProps(['post.description', 'post.entityImages']));
