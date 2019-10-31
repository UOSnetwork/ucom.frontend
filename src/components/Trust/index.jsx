import { useTranslation, Trans } from 'react-i18next';
import { scroller, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import React, { memo, useState, useEffect, Fragment } from 'react';
import styles from './styles.css';
import Button from '../Button/index';
import UserPick from '../UserPick';
import DropdownMenu from '../DropdownMenu';
import Popup from '../Popup';

const Trust = ({
  userName, userAvtarUrl, trusted, onClickTrust, onClickUntrust, loading,
}) => {
  const { t } = useTranslation();
  const [untrustPopupVisible, setUntrustPopupVisible] = useState(false);
  const [acceptCardVisible, setAcceptCardVisible] = useState(false);

  const showAcceptCard = () => {
    scroller.scrollTo('trust', {
      duration: 1000,
      delay: 100,
      offset: -70,
      smooth: true,
    });
    setAcceptCardVisible(true);
  };

  const hideAcceptCard = () => {
    setAcceptCardVisible(false);
  };

  useEffect(() => {
    if (trusted) {
      setAcceptCardVisible(false);
    } else {
      setUntrustPopupVisible(false);
    }
  }, [trusted]);

  return (
    <Fragment>
      {untrustPopupVisible &&
        <Popup showCloseIcon onClickClose={() => setUntrustPopupVisible(false)}>
          <div className={styles.untrust}>
            <h2 className={styles.title}>{t('You are revoking your trust')}</h2>
            <ol className={styles.rules}>
              <li>{t('YouPubliclyPerson')}</li>
              <li>{t('YourPublicTrust')}</li>
              <li>{t('ThisTrustRevoke')}</li>
            </ol>

            <Button big cap red strech disabled={loading} onClick={onClickUntrust}>{t('Revoke trust')}</Button>
          </div>
        </Popup>
      }

      <Element name="trust" className={styles.trust}>
        {trusted &&
          <div className={styles.trusted}>
            <DropdownMenu
              distance={15}
              trigger="mouseenter"
              items={[{
                title: t('Change my mind'),
                onClick: () => setUntrustPopupVisible(true),
              }]}
            >
              <span className={styles.trigger}>
                <Trans i18nKey="You Trust user" userName={userName}>
                  You Trust <UserPick shadow size={24} alt={userName} src={userAvtarUrl} /> <span title={userName}>{{ userName }}</span>
                </Trans>
              </span>
            </DropdownMenu>
          </div>
        }

        {!trusted && !acceptCardVisible &&
          <Button strech grayBorder onClick={showAcceptCard}>
            <Trans i18nKey="Trust user" userName={userName}>
              Trust <UserPick shadow size={24} alt={userName} src={userAvtarUrl} /> <span title={userName}>{{ userName }}</span>
            </Trans>
          </Button>
        }

        {!trusted && acceptCardVisible &&
          <div className={styles.acceptCard}>
            <h3 className={styles.title}>
              <Trans i18nKey="I Trust user" userName={userName}>
                I Trust <UserPick shadow size={32} alt={userName} src={userAvtarUrl} /> <span title={userName}>{{ userName }}</span>
              </Trans>
            </h3>

            <ol className={styles.rules}>
              <li>{t('YouArePubliclyManifesting')}</li>
              <li>{t('YourPublicTrustManifestation')}</li>
              <li>{t('ThisTrustTransaction')}</li>
              <li>{t('TheProfilesYouTrust')}</li>
              <li>{t('ThisTrustTransactionExpands')}</li>
            </ol>

            <div className={styles.action}>
              <Button strech red onClick={onClickTrust} disabled={loading}>{t('Trust')}</Button>
            </div>

            <div className={styles.action}>
              <Button strech transparent disabled={loading} onClick={hideAcceptCard}>{t('Cancel')}</Button>
            </div>
          </div>
        }
      </Element>
    </Fragment>
  );
};

Trust.propTypes = {
  userName: PropTypes.string.isRequired,
  userAvtarUrl: PropTypes.string.isRequired,
  onClickTrust: PropTypes.func.isRequired,
  onClickUntrust: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  trusted: PropTypes.bool,
};

Trust.defaultProps = {
  trusted: false,
  loading: false,
};

export * from './wrappers';
export default memo(Trust);
