import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState, useRef, Fragment, memo, useEffect } from 'react';
import Tippy from '@tippy.js/react';
import { useDispatch, useSelector } from 'react-redux';
import IconFacebook from '../Icons/Socials/Share/Facebook';
import IconTwitter from '../Icons/Socials/Share/Twitter';
import IconTelegram from '../Icons/Socials/Share/Telegram';
import IconCopyLink from '../Icons/CopyLink';
import IconRepost from '../Icons/Repost';
import withLoader from '../../utils/withLoader';
import { addSuccessNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import utilsActions from '../../actions/utils';
import * as postsActions from '../../actions/posts';
import { authShowPopup } from '../../actions/auth';
import { selectOwner, selectPostById } from '../../store/selectors';
import equalByProps from '../../utils/equalByProps';
import { getSocialKey } from '../../utils/keys';
import urls from '../../utils/urls';
import styles from './styles.css';
import ShareButton from './Button';

const Share = ({
  children, directUrl, postId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tippyInstance = useRef();
  const [origin, setOrigin] = useState(null);
  const owner = useSelector(selectOwner, equalByProps(['accountName']));
  const post = useSelector(selectPostById(postId), equalByProps(['blockchainId', 'myselfData']));
  const repostEnable = post && post.myselfData && post.myselfData.repostAvailable;
  const url = directUrl || `${origin}${urls.getPostUrl(post)}`;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const createRepost = async () => {
    if (loading) {
      return;
    }

    const ownerPrivateKey = getSocialKey();

    if (!owner.accountName || !ownerPrivateKey) {
      dispatch(authShowPopup());
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch(postsActions.createRepost(
        owner.accountName,
        ownerPrivateKey,
        post.blockchainId,
        post.id,
      )));

      if (tippyInstance.current) {
        tippyInstance.current.hide();
      }

      dispatch(addSuccessNotification(t('Repost is successful')));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    setLoading(false);
  };

  if (!url) {
    return null;
  }

  return (
    <Tippy
      onCreate={(instance) => {
        tippyInstance.current = instance;
      }}
      arrow
      interactive
      theme="dropdown"
      placement="bottom-center"
      trigger="click"
      content={(
        <div className={styles.share}>
          {postId && repostEnable &&
            <Fragment>
              <div
                role="presentation"
                className={`${styles.title} ${styles.action}`}
                onClick={createRepost}
              >
                <IconRepost />
                {t('Repost to my profile')}
              </div>

              <hr className={styles.line} />
            </Fragment>
          }

          <Fragment>
            <div className={styles.title}>{t('Share to')}</div>

            <div className={styles.icons}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
                href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              >
                <IconFacebook />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
                href={`https://twitter.com/intent/tweet?url=${url}`}
              >
                <IconTwitter />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
                href={`https://telegram.me/share/url?url=${url}`}
              >
                <IconTelegram />
              </a>
            </div>

            <hr className={styles.line} />
          </Fragment>

          <div className={styles.title}>{t('Copy link')}</div>

          <div className={styles.copy}>
            <span className={styles.text}>
              <a target="_blank" rel="noopener noreferrer" className="link red" href={url}>{url}</a>
            </span>
            <span
              role="presentation"
              className={styles.icon}
              onClick={() => {
                if (tippyInstance.current) {
                  tippyInstance.current.hide();
                }
                dispatch(utilsActions.copyToClipboard(url));
              }}
            >
              <IconCopyLink />
            </span>
          </div>
        </div>
      )}
    >
      {children || <ShareButton />}
    </Tippy>
  );
};

Share.propTypes = {
  directUrl: PropTypes.string,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Share.defaultProps = {
  directUrl: undefined,
  postId: undefined,
};

export default memo(Share);
