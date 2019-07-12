import { pick } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { updateUser } from '../../../actions/users';
import IconEdit from '../../Icons/Edit';
import Form from './Form';
import styles from './styles.css';
import { userIsOwner } from '../../../utils/user';
import { sanitizeCommentText, checkMentionTag, checkHashTag } from '../../../utils/text';
import { selectOwner, selectUserById } from '../../../store/selectors';
import { USER_EDITABLE_PROPS } from '../../../utils/constants';
import withLoader from '../../../utils/withLoader';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';

export const PLACEHOLDER = 'What’s Ur Passion…';
export const STATUS_MAX_LENGTH = 130;

const UserStatus = (props) => {
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner);
  const user = useSelector(selectUserById(props.userId));
  const [formVisibility, setFormVisibility] = useState(false);
  const moodMessage = user && user.moodMessage ? user.moodMessage.trim() : undefined;

  const submit = async (moodMessage) => {
    try {
      await withLoader(dispatch(updateUser({
        ...pick(user, USER_EDITABLE_PROPS),
        moodMessage,
      })));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const showForm = () => {
    setFormVisibility(true);
  };

  const hideForm = () => {
    setFormVisibility(false);
  };

  if (!user) {
    return null;
  }

  if (!moodMessage && !userIsOwner(user, owner)) {
    return null;
  }

  const dangerousInnerHTML = {
    __html: sanitizeCommentText(checkMentionTag(checkHashTag(moodMessage || PLACEHOLDER))),
  };

  return (
    <div className={styles.status}>
      {!userIsOwner(user, owner) ? (
        <div
          className={styles.message}
          dangerouslySetInnerHTML={dangerousInnerHTML}
        />
      ) : (
        <div
          role="presentation"
          className={classNames({
            [styles.message]: true,
            [styles.messageEditable]: true,
            [styles.messageEmpty]: !moodMessage,
          })}
          onClick={(e) => {
            if (e.target.tagName !== 'A') {
              showForm();
            }
          }}
        >
          <span dangerouslySetInnerHTML={dangerousInnerHTML} />
          <span className={styles.editIcon}>
            <IconEdit />
          </span>
        </div>
      )}

      {formVisibility &&
        <Form
          moodMessage={moodMessage}
          onClickHide={hideForm}
          onClickSave={submit}
        />
      }
    </div>
  );
};

UserStatus.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default UserStatus;
