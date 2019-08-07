import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import LayoutClean from '../../components/Layout/LayoutClean';
import Toolbar from './Toolbar';
import Medium from '../../components/Medium/index';
import loader from '../../utils/loader';
import withLoader from '../../utils/withLoader';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import * as editPostActions from '../../actions/pages/editPost';
import styles from './styles.css';

const EditPost = ({ match, location }) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.pages.editPost);
  const postId = match.params.id;
  const urlSearchParams = new URLSearchParams(location.search);
  const orgId = urlSearchParams.get('organizationId');

  const fetch = async (postId) => {
    try {
      await withLoader(dispatch(editPostActions.fetch(postId)));
    } catch (err) {
      addErrorNotificationFromResponse(err);
    }
  };

  useEffect(() => {
    if (postId) {
      fetch(postId);
    } else {
      dispatch(editPostActions.restoreData());
      dispatch(editPostActions.setData({ loaded: true }));
    }

    if (orgId) {
      dispatch(editPostActions.changeData({ organizationId: +orgId }));
    }

    return () => {
      dispatch(editPostActions.reset());
    };
  }, [postId]);

  return (
    <LayoutClean>
      <div className={styles.editPost}>
        <Toolbar />

        <div className={styles.content}>
          {state.loaded &&
            <Medium
              entityImages={state.data.entityImages}
              value={state.data.description}
              onChange={({ html, urls }) => {
                dispatch(editPostActions.changeContent(html, urls));
              }}
              // TODO: Move to Medium
              onUploadStart={() => {
                loader.start();
              }}
              // TODO: Move to Medium
              onUploadDone={() => {
                loader.done();
              }}
              onEmbed={(embedData) => {
                try {
                  dispatch(editPostActions.addEmbed(embedData));
                } catch (err) {
                  addErrorNotificationFromResponse(err);
                }
              }}
            />
          }
        </div>

        <Toolbar showClose={false} showTitle={false} />
      </div>
    </LayoutClean>
  );
};

export default EditPost;
