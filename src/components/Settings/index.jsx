import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import React, { useState, Fragment, useEffect } from 'react';
import Popup, { Content } from '../Popup';
import styles from './styles.css';
// import CopyPanel from '../CopyPanel';
import Button from '../Button/index';
import VerticalMenu from '../VerticalMenu/index';
import { settingsHide } from '../../actions/settings';
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
import { addErrorNotification } from '../../actions/notifications';
import IconInputComplete from '../Icons/InputComplete';
import urls from '../../utils/urls';

const Settings = (props) => {
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [generateSocialKeyVisible, setGenerateSocialKeyVisible] = useState(false);
  const [passwordIsSet, setPasswordIsSet] = useState(encryptedActiveKeyIsExists());
  const [keys, setKeys] = useState({});

  useEffect(() => {
    try {
      if (socialKeyIsExists()) {
        const socialKey = restoreSocialKey();
        setKeys({
          ...keys,
          socialKey,
          socialPublicKey: getPublicKeyByPrivateKey(socialKey),
        });
      }
    } catch (e) {
      props.dispatch(addErrorNotification(e.message));
    }
  }, []);

  if (!props.settings.visible) {
    return null;
  }

  return (
    // TODO: Use Grid/styles.css for profile grid
    <Fragment>
      <Popup
        id="settings-popup"
        onClickClose={() => props.dispatch(settingsHide())}
        paddingBottom="50vh" // TODO: Change to 25vh when social keys enabled
      >
        <Content
          fixWidth
          onClickClose={() => props.dispatch(settingsHide())}
        >
          <div className={styles.settings}>
            <div className={styles.sidebar}>
              <VerticalMenu
                sticky
                stickyTop={86}
                sections={[
                  { title: 'Resources', name: 'Resources' },
                  { title: 'Keys', name: 'Keys' },
                ]}
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
            </div>
            <div className={styles.footer}>
              Go to&nbsp;
              <Link
                className="link red"
                to={urls.getUserEditProfileUrl(props.owner.id)}
                onClick={() => props.dispatch(settingsHide())}
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
              props.dispatch(addErrorNotification(e.message));
            }
          }}
        />
      }
    </Fragment>
  );
};

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
  }).isRequired,
  owner: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default connect(state => ({
  settings: state.settings,
  owner: state.user.data,
}))(Settings);
