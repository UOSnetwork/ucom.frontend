import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState, Fragment } from 'react';
import UserListPopup from './UserListPopup';
import UserListPopupMore from './UserListPopupMore';
import urls from '../../utils/urls';
import { getUsersByIds } from '../../store/users';
import EntryCard from '../EntryCard';
import Popup from '../Popup';
import ModalContent from '../ModalContent';
import { getUserName } from '../../utils/user';
import styles from '../List/styles.css';

const UserList = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);

  if (!props.usersIds.length) {
    return null;
  }

  const visibleUsers = getUsersByIds(props.users, props.usersIds, props.limit);

  return (
    <Fragment>
      {visibleUsers.map(item => (
        <Link
          key={item.id}
          className={styles.item}
          to={urls.getUserUrl(item.id)}
        >
          <EntryCard
            disabledLink
            avatarSrc={urls.getFileUrl(item.avatarFilename)}
            url={urls.getUserUrl(item.id)}
            title={getUserName(item)}
            nickname={item.accountName}
            scaledImportance={item.scaledImportance}
          />
        </Link>
      ))}

      {props.usersIds.length > props.limit &&
        <div className={styles.more}>
          <span
            role="presentation"
            className={styles.moreLink}
            onClick={() => {
              setPopupVisible(true);
              if (props.loadMore) {
                props.loadMore();
              }
            }}
          >
            View All
          </span>
        </div>
      }

      {popupVisible &&
        <Popup onClickClose={() => setPopupVisible(false)}>
          <ModalContent onClickClose={() => setPopupVisible(false)}>
            {props.tagTitle ? (
              <UserListPopupMore
                usersIds={props.usersIds}
                tagTitle={props.tagTitle}
              />
            ) : (
              <UserListPopup
                usersIds={props.usersIds}
              />
            )}
          </ModalContent>
        </Popup>
      }
    </Fragment>
  );
};

UserList.propTypes = {
  usersIds: PropTypes.arrayOf(PropTypes.number),
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  limit: PropTypes.number,
  loadMore: PropTypes.func,
  tagTitle: PropTypes.string,
};

UserList.defaultProps = {
  usersIds: [],
  limit: 5,
  loadMore: null,
  tagTitle: null,
};

export default connect(state => ({
  users: state.users,
}))(UserList);
