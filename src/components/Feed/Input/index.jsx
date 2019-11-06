import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserPick from '../../UserPick';
import urls from '../../../utils/urls';
import FeedForm from '../FeedForm';
import equalByProps from '../../../utils/equalByProps';
import { selectOwner, selectUserById, selectOrgById } from '../../../store/selectors';
import { getSocialKey } from '../../../utils/keys';
import withLoader from '../../../utils/withLoader';
import { authShowPopup } from '../../../actions/auth';
import { addErrorNotificationFromResponse, addNonMultiSignError } from '../../../actions/notifications';
import { POST_TYPE_DIRECT_ID } from '../../../utils/constants';
import { createPost } from '../../../actions/feed';
import styles from './styles.css';

const FeedInput = ({
  initialText, forUserId, forOrgId, onSubmit, disabledForNonMultiOrg,
}) => {
  const owner = useSelector(selectOwner, equalByProps(['avatarFilename', 'id', 'accountName']));
  const user = useSelector(selectUserById(forUserId), equalByProps(['accountName']));
  const org = useSelector(selectOrgById(forOrgId), equalByProps(['blockchainId']));
  const [formVisible, setFormVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [entityImages, setEntityImages] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const hideForm = () => {
    setFormVisible(false);
  };

  const showForm = async () => {
    if (disabledForNonMultiOrg) {
      dispatch(addNonMultiSignError());
      return;
    }

    setFormVisible(true);
  };

  const submit = useCallback(async (message, entityImagesAsJson) => {
    const privateKey = getSocialKey();

    if (!owner.id || !owner.accountName || !privateKey) {
      dispatch(authShowPopup());
      return;
    }

    setLoading(true);

    try {
      const post = await withLoader(dispatch(createPost(
        owner.id,
        owner.accountName,
        privateKey,
        forUserId,
        user && user.accountName,
        forOrgId,
        org && org.blockchainId,
        {
          description: message,
          entityImages: entityImagesAsJson,
          postTypeId: POST_TYPE_DIRECT_ID,
        },
      )));

      if (onSubmit) {
        onSubmit(post);
      }

      setEntityImages({});
      setDescription('');
      hideForm();
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotificationFromResponse(err));
    }

    setLoading(false);
  }, [owner, user, org, loading, description, entityImages]);

  if (!owner) {
    return null;
  }

  return (
    <div className={styles.feedInput}>
      <div
        role="presentation"
        className={styles.invite}
        onClick={showForm}
      >
        <Trans i18nKey="heyWhatsWew">
          <span>Hey</span>
          <UserPick src={urls.getFileUrl(owner.avatarFilename)} />
          <span>what’s new?</span>
        </Trans>
      </div>

      {formVisible &&
        <div className={styles.container}>
          <div
            role="presentation"
            className={styles.overlay}
            onClick={hideForm}
          />

          <FeedForm
            loading={loading}
            onEntityImages={setEntityImages}
            onMessage={setDescription}
            onSubmit={submit}
            onCancel={hideForm}
            initialText={initialText}
            message={description}
            entityImages={entityImages}
          />
        </div>
      }
    </div>
  );
};

FeedInput.propTypes = {
  initialText: PropTypes.string,
  onSubmit: PropTypes.func,
  forUserId: PropTypes.number,
  forOrgId: PropTypes.number,
};

FeedInput.defaultProps = {
  initialText: undefined,
  onSubmit: undefined,
  forUserId: undefined,
  forOrgId: undefined,
};

export default memo(FeedInput);
