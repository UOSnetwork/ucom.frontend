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
import Resources from '../Resources';
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
import * as settingsActions from '../../actions/settings';
import IconInputComplete from '../Icons/InputComplete';
import urls from '../../utils/urls';
import withLoader from '../../utils/withLoader';
import { selectOwner } from '../../store/selectors';

const Settings = () => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const state = useSelector(state => state.settings);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [generateSocialKeyVisible, setGenerateSocialKeyVisible] = useState(false);
  const [passwordIsSet, setPasswordIsSet] = useState(encryptedActiveKeyIsExists());
  const [keys, setKeys] = useState({});

  const sections = [
    { title: 'Resources', name: 'Resources' },
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
                <h2 className={styles.title}>Account Settings</h2>
                <p>This section contains settings of your blockchain account.</p>
              </div>

              <Element className={styles.section} name="Resources">
                <h3 className={styles.title}>Resources</h3>
                <Resources />
              </Element>

              <Element
                name="Keys"
                className={styles.section}
              >
                <h3 className={styles.title}>Keys</h3>
                {/* TODO: Enable when auth and registration by social key feature complete */}
                {/* <div className={styles.subSection}>
                  <h4 className={styles.title}>Social Keys</h4>
                  <p>The pair of Social Keys is needed to sign your social transactions. After authorization on the platform, it is stored in your browser.</p>
                  {keys.socialKey ? (
                    <Fragment>
                      <div className={styles.copy}>
                        <CopyPanel
                          label="Private"
                          value={keys.socialKey}
                        />
                      </div>
                      <div className={styles.copy}>
                        <CopyPanel
                          label="Public"
                          value={keys.socialPublicKey}
                        />
                      </div>
                    </Fragment>
                  ) : (
                    <div className={styles.action}>
                      <Button
                        strech
                        small
                        onClick={() => setGenerateSocialKeyVisible(true)}
                      >
                        Generate Social Key
                      </Button>
                    </div>
                  )}
                </div> */}

                <div className={styles.subSection}>
                  <h4 className={styles.title}>Password for Active Key</h4>
                  <p>You can set a Password to save a pair of encrypted Active Keys in your browser. This allows you to send the transactions, that require Active Keys, using your Password instead. You will need to enter the Brainkey to unlock your Active Keys.</p>
                  {!passwordIsSet ? (
                    <div className={styles.action}>
                      <Button
                        strech
                        small
                        onClick={() => setChangePasswordVisible(true)}
                      >
                        Set Password
                      </Button>
                    </div>
                  ) : (
                    <div className={`${styles.action} ${styles.withLabel}`}>
                      <div className={styles.label}>
                        <IconInputComplete />
                        <span className={styles.text}>Password set</span>
                      </div>

                      <Button
                        strech
                        small
                        onClick={() => setChangePasswordVisible(true)}
                      >
                        Reset password
                      </Button>
                    </div>
                  )}
                </div>

                <div className={styles.subSection}>
                  <OwnerActiveKeys />
                </div>
              </Element>

              {owner.affiliates && owner.affiliates.referralRedirectUrl &&
                <Element
                  name="Referral"
                  className={styles.section}
                >
                  <h3 className={styles.title}>Referral Link</h3>

                  <div className={styles.subSection}>
                    <p>Provide a referral link to your friend and gain importance from your referrals, registered on the platform. You get half the importance they acquire.</p>
                    <div className={styles.copy}>
                      <CopyPanel
                        label="Your referral link"
                        value={owner.affiliates.referralRedirectUrl}
                      />
                    </div>
                  </div>

                  {state.refferals.ids.length > 0 &&
                    <div className={styles.subSection}>
                      <h4 className={styles.title}>Your Refferals</h4>
                      <div className={styles.refferals}>
                        <EntryListSectionUsersWrapper
                          titleEnabled={false}
                          title="Your Refferals"
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
            </div>

            <div className={styles.footer}>
              Go to&nbsp;
              <Link
                className="link red"
                to={urls.getUserEditProfileUrl(owner.id)}
              >
                Profile Edit
              </Link>
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
