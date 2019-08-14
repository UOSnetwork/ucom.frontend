import PropTypes from 'prop-types';
import React, { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import UserPick from '../../UserPick';
import urls from '../../../utils/urls';
import FeedForm from '../FeedForm';
import equalByProps from '../../../utils/equalByProps';
import { selectOwner } from '../../../store/selectors';
import styles from './styles.css';

const FeedInput = ({ initialText, onSubmit }) => {
  const owner = useSelector(selectOwner, equalByProps(['avatarFilename']));
  const [formVisible, setFormVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [entityImages, setEntityImages] = useState({});

  const hideForm = () => {
    setFormVisible(false);
  };

  const showForm = () => {
    setFormVisible(true);
  };

  const createPost = (message, fileImg) => {
    if (onSubmit) {
      onSubmit(message, fileImg);
    }

    setEntityImages({});
    setMessage('');
    hideForm();
  };

  if (!owner) {
    return null;
  }

  return (
    <div className={styles.feedInput}>
      <div
        role="presentation"
        className={styles.invite}
        onClick={showForm}
      >
        <span>Hey</span>
        <UserPick src={urls.getFileUrl(owner.avatarFilename)} />
        <span>what’s new?</span>
      </div>

      {formVisible &&
        <div className={styles.container}>
          <div
            role="presentation"
            className={styles.overlay}
            onClick={hideForm}
          />
          <FeedForm
            onEntityImages={setEntityImages}
            onMessage={setMessage}
            onSubmit={createPost}
            onCancel={hideForm}
            initialText={initialText}
            message={message}
            entityImages={entityImages}
          />
        </div>
      }
    </div>
  );
};

FeedInput.propTypes = {
  initialText: PropTypes.string,
  onSubmit: PropTypes.func,
};

FeedInput.defaultProps = {
  initialText: undefined,
  onSubmit: undefined,
};

export default memo(FeedInput);
