import { useTranslation } from 'react-i18next';
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
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import * as editPostActions from '../../../actions/pages/editPost';
import withLoader from '../../../utils/withLoader';
import urls from '../../../utils/urls';
import styles from './styles.css';
import { isSubmitKey } from '../../../utils/keyboard';

const SubmitPopup = ({ onClickClose, location, history }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector(state => state.pages.editPost, isEqual);
  const urlSearchParams = new URLSearchParams(location.search);
  const orgId = urlSearchParams.get('organizationId');

  const save = async () => {
    let postId;

    try {
      postId = await withLoader(dispatch(editPostActions.save(orgId)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    if (postId) {
      history.push(urls.getPostUrl({ id: postId }));
    }
  };

  const saveIfSubmitKey = (e) => {
    if (isSubmitKey(e)) {
      save();
    }
  };

  return (
    <Popup onClickClose={onClickClose}>
      <Content fixWidth={false} onClickClose={onClickClose}>
        <form className={styles.submitPopup}>
          <div className={styles.title}>{t('Publication preview')}</div>

          <div className={styles.field}>
            <Cover />
          </div>

          <div className={styles.field}>
            <TextareaAutosize
              autoFocus
              rows="1"
              maxLength={VALIDATION_INPUT_MAX_LENGTH}
              placeholder={t('Preview title')}
              value={state.data.title}
              onChange={title => dispatch(editPostActions.changeData({ title }))}
              className={styles.input}
              onKeyDown={saveIfSubmitKey}
            />
          </div>

          <div className={styles.field}>
            <TextareaAutosize
              rows="1"
              maxLength={VALIDATION_INPUT_MAX_LENGTH}
              placeholder={t('Preview description')}
              value={state.data.leadingText}
              onChange={leadingText => dispatch(editPostActions.changeData({ leadingText }))}
              className={`${styles.input} ${styles.small}`}
              onKeyDown={saveIfSubmitKey}
            />
          </div>

          <div className={styles.actions}>
            <div>
              <CreateBy enabled={!state.data.id} />
            </div>
            <Button red small disabled={state.loading} onClick={save}>{t('Publish')}</Button>
          </div>
        </form>
      </Content>
    </Popup>
  );
};

SubmitPopup.propTypes = {
  onClickClose: PropTypes.func.isRequired,
};

export default withRouter(memo(SubmitPopup));
