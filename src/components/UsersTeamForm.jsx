import React, { useState } from 'react';
import Link from 'react-router-dom';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import UserSearchInput from './UserSearchInput';
// import UserCard from './UserCard';
import EntryCard from './EntryCard/index';
import IconRemove from './Icons/Remove';
import { getUserName } from '../utils/user';
import urls from '../utils/urls';
import { getUsersTeamStatusById } from '../utils/organization';
import {
  USERS_TEAM_STATUS_ID_CONFIRMED,
  USERS_TEAM_STATUS_ID_DECLINED,
} from '../store/organization';
import Button from './Button/index';

const UsersTeamForm = (props) => {
  const [teamFormVisible, setTeamFormVisible] = useState(false);

  console.log('users: ', props.users);

  return (
    <div className="board-form">
      {props.users.map((item, index) => (
        <div key={item.id}>
          <Link
            to={urls.getUserUrl(item.id)}
            // className={styles.userCard}
            target="_blank"
          >
            <EntryCard
              disableRate
              disabledLink
              id={item.id}
              title={item.firstName}
              nickname={item.accountName}
              url={urls.getUserUrl(item.id)}
              avatarSrc={urls.getFileUrl(item.avatarFilename)}
            />
          </Link>
          <div
            className={classNames(
              'user-cards-list__status',
              { 'user-cards-list__status_confirmed': item.usersTeamStatus === USERS_TEAM_STATUS_ID_CONFIRMED },
              { 'user-cards-list__status_declined': item.usersTeamStatus === USERS_TEAM_STATUS_ID_DECLINED },
            )}
          >
            {getUsersTeamStatusById(item.usersTeamStatus)}
          </div>
          <div className="user-cards-list__remove">
            <button
              className="button-clean"
              onClick={() => {
                if (typeof props.onChange === 'function') {
                  const users = [].concat(props.users);
                  users.splice(index, 1);
                  props.onChange(users);
                }
              }}
            >
              <IconRemove />
            </button>
          </div>
        </div>
      ))}
      <div className="board-form__input">
        {teamFormVisible &&
          <UserSearchInput
            isMulti
            value={[]}
            placeholder="Search for one of community members…"
            onChange={(data) => {
              if (typeof props.onChange === 'function') {
                const users = uniqBy(props.users.concat(data), item => item.id);
                props.onChange(users);
                setTeamFormVisible(false);
              }
            }}
          />
        }
      </div>
      <Button
        small
        grayBorder
        onClick={() => setTeamFormVisible(true)}
      >
        Add Admin
      </Button>
    </div>
  );
};

UsersTeamForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
};

UsersTeamForm.defaultProps = {
  users: [],
};

export default UsersTeamForm;
