import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo } from 'react';
import Popup, { Content } from '../../../components/Popup';
import TextareaAutosize from '../../../components/TextareaAutosize';
import { VALIDATION_INPUT_MAX_LENGTH } from '../../../utils/constants';
import Button from '../../../components/Button/index';
import CreateBy from '../CreateBy';
import Cover from './Cover';
import { authShowPopup } from '../../../actions/auth';
import { addDiscussion } from '../../../actions/organizations';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import * as editPostActions from '../../../actions/pages/editPost';
import { getSocialKey } from '../../../utils/keys';
import withLoader from '../../../utils/withLoader';
import urls from '../../../utils/urls';
import { selectOwner } from '../../../store/selectors';
import styles from './styles.css';

const SubmitPopup = ({ onClickClose, location, history }) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.pages.editPost, isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const urlSearchParams = new URLSearchParams(location.search);
  const orgId = urlSearchParams.get('organizationId');

  // TODO: Move all buisnes logic to redux action
  const save = async () => {
    let postId;
    const privateKey = getSocialKey();

    if (!owner.accountName || !privateKey) {
      dispatch(authShowPopup());
      return;
    }

    try {
      postId = await withLoader(dispatch(editPostActions.save(owner.accountName, privateKey)));
      if (orgId) {
        await withLoader(dispatch(addDiscussion(postId, orgId)));
      }
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    if (postId) {
      history.push(urls.getPostUrl({ id: postId }));
    }
  };

  return (
    <Popup onClickClose={onClickClose}>
      <Content fixWidth={false} onClickClose={onClickClose}>
        <div className={styles.submitPopup}>
          <div className={styles.title}>Publication preview</div>

          <div className={styles.field}>
            <Cover />
          </div>

          <div className={styles.field}>
            <TextareaAutosize
              autoFocus
              rows="1"
              maxLength={VALIDATION_INPUT_MAX_LENGTH}
              placeholder="Preview title"
              value={state.data.title}
              onChange={title => dispatch(editPostActions.changeData({ title }))}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <TextareaAutosize
              rows="1"
              maxLength={VALIDATION_INPUT_MAX_LENGTH}
              placeholder="Preview description"
              value={state.data.leadingText}
              onChange={leadingText => dispatch(editPostActions.changeData({ leadingText }))}
              className={`${styles.input} ${styles.small}`}
            />
          </div>

          <div className={styles.actions}>
            <div>
              <CreateBy enabled={!state.data.id} />
            </div>
            <Button
              red
              small
              disabled={state.loading}
              onClick={save}
            >
              Publish
            </Button>
          </div>
        </div>
      </Content>
    </Popup>
  );
};

SubmitPopup.propTypes = {
  onClickClose: PropTypes.func.isRequired,
};

export default withRouter(memo(SubmitPopup));
