import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Element } from 'react-scroll';
import React, { useState, Fragment, useEffect } from 'react';
import Popup, { Content } from '../Popup';
import styles from './styles.css';
import CopyPanel from '../CopyPanel';
import Button from '../Button/index';
import VerticalMenu from '../VerticalMenu/index';
import { EntryListSectionUsersWrapper } from '../EntryListSection';
import ChangePassword from '../Auth/Features/ChangePassword';
import GenerateSocialKey from '../Auth/Features/GenerateSocialKey';
import {
  restoreSocialKey,
  socialKeyIsExists,
  getPublicKeyByPrivateKey,
  encryptedActiveKeyIsExists,
} from '../../utils/keys';
import OwnerActiveKeys from './OwnerActiveKeys';
import { addErrorNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import * as subscribeActions from '../../actions/subscribe';
import * as settingsActions from '../../actions/settings';
import IconInputComplete from '../Icons/InputComplete';
import urls from '../../utils/urls';
import withLoader from '../../utils/withLoader';
import { selectOwner } from '../../store/selectors';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const state = useSelector(state => state.settings);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [generateSocialKeyVisible, setGenerateSocialKeyVisible] = useState(false);
  const [passwordIsSet, setPasswordIsSet] = useState(encryptedActiveKeyIsExists());
  const [keys, setKeys] = useState({});

  const sections = [
    { title: 'Keys', name: 'Keys' },
  ];

  if (owner.affiliates && owner.affiliates.referralRedirectUrl) {
    sections.push({ title: 'Referral Link', name: 'Referral' });
  }

  const onClickClose = () => {
    window.location.hash = '';
  };

  const getReferrals = async (page) => {
    try {
      await withLoader(dispatch(settingsActions.getReferrals(owner.id, page)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const restoreKeys = () => {
    try {
      if (socialKeyIsExists()) {
        const socialKey = restoreSocialKey();
        setKeys({
          ...keys,
          socialKey,
          socialPublicKey: getPublicKeyByPrivateKey(socialKey),
        });
      }
    } catch (err) {
      dispatch(addErrorNotification(err.message));
    }
  };

  useEffect(() => {
    restoreKeys();

    return () => {
      dispatch(settingsActions.reset());
    };
  }, []);

  useEffect(() => {
    if (owner.id) {
      getReferrals(1);
    }
  }, [owner.id]);

  return (
    <Fragment>
      <Popup
        id="settings-popup"
        onClickClose={onClickClose}
        paddingBottom="70vh"
      >
        <Content
          onClickClose={onClickClose}
        >
          <div className={styles.settings}>
            <div className={styles.sidebar}>
              <VerticalMenu
                sticky
                stickyTop={86}
                sections={sections}
                scrollerOptions={{
                  spy: true,
                  duration: 500,
                  delay: 100,
                  offset: -73,
                  smooth: true,
                  containerId: 'settings-popup',
                }}
              />
            </div>
            <div className={styles.content}>
              <div className={styles.section}>
                <h2 className={styles.title}>{t('Account Settings')}</h2>
                <p>{t('sectionContainsSettings')}</p>
              </div>

              <Element
                name="Keys"
                className={styles.section}
              >
                <h3 className={styles.title}>{t('Keys')}</h3>
                <div className={styles.subSection}>
                  <h4 className={styles.title}>{t('Social Keys')}</h4>
                  <p>{t('pairSocialKeysNeeded')}</p>
                  {keys.socialKey ? (
                    <Fragment>
                      <div className={styles.copy}>
                        <CopyPanel label={t('Private')} value={keys.socialKey} />
                      </div>
                      <div className={styles.copy}>
                        <CopyPanel
                          label={t('Public')}
                          value={keys.socialPublicKey}
                        />
                      </div>
                    </Fragment>
                  ) : (
                    <div className={styles.action}>
                      <Button strech small onClick={() => setGenerateSocialKeyVisible(true)}>
                        {t('Generate Social Key')}
                      </Button>
                    </div>
                  )}
                </div>

                <div className={styles.subSection}>
                  <h4 className={styles.title}>{t('Password for Active Key')}</h4>
                  <p>{t('canSetPassword')}</p>
                  {!passwordIsSet ? (
                    <div className={styles.action}>
                      <Button strech small onClick={() => setChangePasswordVisible(true)}>
                        {t('auth.setPassword')}
                      </Button>
                    </div>
                  ) : (
                    <div className={`${styles.action} ${styles.withLabel}`}>
                      <div className={styles.label}>
                        <IconInputComplete />
                        <span className={styles.text}>{t('Password set')}</span>
                      </div>

                      <Button strech small onClick={() => setChangePasswordVisible(true)}>
                        {t('Reset password')}
                      </Button>
                    </div>
                  )}
                </div>

                <div className={styles.subSection}>
                  <OwnerActiveKeys />
                </div>
              </Element>

              {owner.affiliates && owner.affiliates.referralRedirectUrl &&
                <Element name="Referral" className={styles.section}>
                  <h3 className={styles.title}>{t('Referral Link')}</h3>

                  <div className={styles.subSection}>
                    <p>{t('provideReferralLink')}</p>
                    <div className={styles.copy}>
                      <CopyPanel
                        label="Your referral link"
                        value={owner.affiliates.referralRedirectUrl}
                      />
                    </div>
                  </div>

                  {state.refferals.ids.length > 0 &&
                    <div className={styles.subSection}>
                      <h4 className={styles.title}>{t('Your Referrals')}</h4>
                      <div className={styles.refferals}>
                        <EntryListSectionUsersWrapper
                          titleEnabled={false}
                          title={t('Your Referrals')}
                          limit={3}
                          showViewMore={state.refferals.metadata.totalAmount > state.refferals.ids.length}
                          count={state.refferals.metadata.totalAmount}
                          ids={state.refferals.ids}
                          popupIds={state.refferals.popupIds}
                          popupMetadata={state.refferals.metadata}
                          onChangePage={getReferrals}
                        />
                      </div>
                    </div>
                  }
                </Element>
              }

              <div className={styles.subscribe}>
                {t('Don’t miss a new platform release, token giveaway, or anything else we’ve got in stash!')}
                <Trans i18nKey="fillForm">
                  Fill the form to&nbsp;<span role="presentation" className="link red" onClick={() => dispatch(subscribeActions.show())}>subscribe</span> to&nbsp;our weekly updates.
                </Trans>
              </div>
            </div>

            <div className={styles.footer}>
              <Trans i18nKey="Go to Profile Edit">
                Go to&nbsp;
                <Link className="link red" to={urls.getUserEditProfileUrl(owner.id)}>
                  Profile Edit
                </Link>
              </Trans>
            </div>
          </div>
        </Content>
      </Popup>

      {changePasswordVisible &&
        <ChangePassword
          closeText="Cancel"
          onClickClose={() => setChangePasswordVisible(false)}
          onSubmit={() => {
            setPasswordIsSet(encryptedActiveKeyIsExists());
            setChangePasswordVisible(false);
          }}
        />
      }

      {generateSocialKeyVisible &&
        <GenerateSocialKey
          closeText="Cancel"
          onClickClose={() => setGenerateSocialKeyVisible(false)}
          onSubmit={(socialKey) => {
            setGenerateSocialKeyVisible(false);
            try {
              setKeys({
                ...keys,
                socialKey,
                socialPublicKey: getPublicKeyByPrivateKey(socialKey),
              });
            } catch (e) {
              dispatch(addErrorNotification(e.message));
            }
          }}
        />
      }
    </Fragment>
  );
};

export default Settings;
