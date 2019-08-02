import { withRouter } from 'react-router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect, Fragment } from 'react';
import UserPick from '../UserPick';
import styles from './styles.css';
import EntryListPopup from '../EntryListPopup';

const Followers = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const avatarUsers = props.users.slice(0, 2);

  const hasUsers = () => props.users.length > 0;

  const showPopup = () => {
    if (props.onClick) {
      props.onClick();
      return;
    }

    if (hasUsers()) {
      setPopupVisible(true);
    }
  };

  useEffect(() => {
    setPopupVisible(false);
  }, [props.location]);

  return (
    <Fragment>
      {popupVisible &&
        <EntryListPopup
          title={props.title}
          data={props.popupUsers}
          metadata={props.metadata}
          onChangePage={props.onChangePage}
          onClickClose={() => setPopupVisible(false)}
        />
      }

      <div
        role="presentation"
        className={classNames({
          [styles.followers]: true,
          [styles.followersActive]: hasUsers(),
        })}
        onClick={() => showPopup()}
      >
        <div className={styles.info}>
          <div
            className={classNames(
              `${styles.count}`,
              { [styles.countLighter]: props.colorLight },
            )}
          >
            {props.count}
          </div>

          <div
            className={classNames(
              `${styles.title}`,
              { [styles.titleLighter]: props.colorLight },
            )}
          >
            {props.title}
          </div>
        </div>

        <div className={styles.avatars}>
          {avatarUsers.length === 2 &&
            <Fragment>
              <div className={styles.avatarSmall}>
                <UserPick shadow stretch src={avatarUsers[1].avatarSrc} />
              </div>
              <div className={styles.avatar}>
                <UserPick shadow stretch src={avatarUsers[0].avatarSrc} />
              </div>
            </Fragment>
          }
          {avatarUsers.length === 1 &&
            <div className={styles.avatar}>
              <UserPick shadow stretch src={avatarUsers[0].avatarSrc} />
            </div>
          }
          {avatarUsers.length === 0 &&
            <div className={styles.avatarEmpty} />
          }
        </div>
      </div>
    </Fragment>
  );
};

Followers.propTypes = {
  title: PropTypes.string,
  users: EntryListPopup.propTypes.data,
  popupUsers: EntryListPopup.propTypes.data,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  count: PropTypes.number,
  metadata: EntryListPopup.propTypes.metadata,
  onChangePage: PropTypes.func,
  onClick: PropTypes.func,
  colorLight: PropTypes.bool,
};

Followers.defaultProps = {
  title: 'Followers',
  users: [],
  popupUsers: [],
  count: 0,
  metadata: undefined,
  onChangePage: undefined,
  onClick: undefined,
  colorLight: false,
};

export * from './wrappers';
export default withRouter(Followers);
