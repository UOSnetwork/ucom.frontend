import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { Fragment, memo } from 'react';
import DropzoneWrapper from '../../../../components/DropzoneWrapper';
import IconClose from '../../../../components/Icons/Close';
import IconCover from '../../../../components/Icons/Cover';
import { getPostCoverUrlUrl, removePostCover } from '../../../../utils/entityImages';
import withLoader from '../../../../utils/withLoader';
import { addErrorNotificationFromResponse } from '../../../../actions/notifications';
import * as editPostAction from '../../../../actions/pages/editPost';
import styles from './styles.css';

const Cover = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.pages.editPost, isEqual);
  const postCoverUrl = getPostCoverUrlUrl(state.data.entityImages);

  const change = async (file) => {
    try {
      await withLoader(dispatch(editPostAction.changeCover(file)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const remove = () => {
    dispatch(editPostAction.changeData({
      entityImages: removePostCover(state.data.entityImages),
    }));
  };

  return (
    <DropzoneWrapper
      className={styles.cover}
      multiple={false}
      accept="image/jpeg, image/png, image/gif"
      onChange={change}
    >
      <div className={styles.preview}>
        {postCoverUrl ? (
          <Fragment>
            <span
              role="presentation"
              className={styles.remove}
              onClick={(e) => {
                e.stopPropagation();
                remove();
              }}
            >
              <IconClose />
            </span>
            <img src={postCoverUrl} alt="" />
          </Fragment>
        ) : (
          <span className={styles.icon}>
            <IconCover />
          </span>
        )}
      </div>
    </DropzoneWrapper>
  );
};

export default memo(Cover);
