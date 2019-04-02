import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import React, { useState, useEffect, Fragment } from 'react';
import UserPick from '../UserPick/UserPick';
import { getUsersByIds } from '../../store/users';
import { selectUser } from '../../store/selectors/user';
import urls from '../../utils/urls';
import styles from './styles.css';
import EntryListPopup from '../EntryListPopup';
import { getUserName } from '../../utils/user';

// TODO: Rename folder Followers to abstract name
const Followers = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const hasUsers = () => props.usersIds.length > 0;

  const showPopup = () => {
    if (hasUsers()) {
      setPopupVisible(true);
    }
  };

  useEffect(() => {
    setPopupVisible(false);
  }, [props.location]);

  const users = getUsersByIds(props.users, props.usersIds);
  const avatarUsers = users.slice(0, 2);

  return (
    <Fragment>
      {popupVisible &&
        <EntryListPopup
          title={props.title}
          data={users.map(item => ({
            id: item.id,
            avatarSrc: urls.getFileUrl(item.avatarFilename),
            url: urls.getUserUrl(item.id),
            title: getUserName(item),
            nickname: item.accountName,
            currentRate: item.currentRate,
            follow: true,
          }))}
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
          <div className={styles.count}>
            {users.length}
          </div>

          <div className={styles.title}>
            {props.title}
          </div>
        </div>

        <div className={styles.avatars}>
          {avatarUsers.length === 2 &&
            <Fragment>
              <div className={styles.avatarSmall}>
                <UserPick shadow stretch src={urls.getFileUrl(avatarUsers[1].avatarFilename)} />
              </div>
              <div className={styles.avatar}>
                <UserPick shadow stretch src={urls.getFileUrl(avatarUsers[0].avatarFilename)} />
              </div>
            </Fragment>
          }
          {avatarUsers.length === 1 &&
            <div className={styles.avatar}>
              <UserPick shadow stretch src={urls.getFileUrl(avatarUsers[0].avatarFilename)} />
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
  usersIds: PropTypes.arrayOf(PropTypes.number),
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

Followers.defaultProps = {
  title: 'Followers',
  usersIds: [],
};

export default withRouter(connect(state => ({
  users: state.users,
  user: selectUser(state),
}))(Followers));