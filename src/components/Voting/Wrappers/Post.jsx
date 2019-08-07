import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo, useState, useCallback } from 'react';
import Votin from '../index';
import { selectOwner, selectPostById, selectUsersByIds } from '../../../store/selectors';
import { authShowPopup } from '../../../actions/auth';
import { vote } from '../../../actions/posts';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import { formatRate } from '../../../utils/rate';
import withLoader from '../../../utils/withLoader';
import { TAB_ID_ALL } from '../UsersPopup/Tabs';
import graphql from '../../../api/graphql';
import urls from '../../../utils/urls';

const PostVotingWrapper = ({ postId }) => {
  const dispatch = useDispatch();
  const [upCount, setUpCount] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [upUserPicks, setUpUserPicks] = useState([]);
  const [downUserPicks, setDownUserPicks] = useState([]);
  const [popupActiveTabId, setPopupActiveTabId] = useState(TAB_ID_ALL);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupUsersIds, setPopupUsersIds] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const post = useSelector(selectPostById(postId), isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const users = useSelector(selectUsersByIds(popupUsersIds), isEqual);

  const getDataForPreview = useCallback(async () => {
    setDetailsLoading(true);
    try {
      const { downvotes, upvotes } = await withLoader(graphql.getVotesForPostPreview(postId));
      setUpCount(upvotes.metadata.totalAmount);
      setDownCount(downvotes.metadata.totalAmount);
      setUpUserPicks(upvotes.data);
      setDownUserPicks(downvotes.data);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setDetailsLoading(false);
  }, []);

  return (
    <Votin
      rate={formatRate(post.currentRate, true)}
      count={post.currentVote}
      selfVote={post.myselfData && post.myselfData.myselfVote}
      onClickUp={async () => {
        if (!owner.id) {
          dispatch(authShowPopup());
          return;
        }
        try {
          await withLoader(dispatch(vote(true, postId)));
        } catch (err) {
          dispatch(addErrorNotificationFromResponse(err));
        }
      }}
      onClickDown={async () => {
        if (!owner.id) {
          dispatch(authShowPopup());
          return;
        }
        try {
          await withLoader(dispatch(vote(false, postId)));
        } catch (err) {
          dispatch(addErrorNotificationFromResponse(err));
        }
      }}
      onShow={getDataForPreview}
      details={{
        upCount,
        downCount,
        upUserPicks: {
          userPicks: upUserPicks.map(item => ({
            url: urls.getUserUrl(item.id),
            src: urls.getFileUrl(item.avatarFilename),
          })),
          onClickMore: () => {
            setPopupVisible(true);
          },
        },
        downUserPicks: {
          userPicks: downUserPicks.map(item => ({
            url: urls.getUserUrl(item.id),
            src: urls.getFileUrl(item.avatarFilename),
          })),
          onClickMore: () => {
            setPopupVisible(true);
          },
        },
        loading: detailsLoading,
      }}
      usersPopup={{
        users, // TODO: Map props
        visible: popupVisible,
        onClickClose: () => {
          setPopupVisible(false);
        },
        onLoadMore: () => {
          console.log('on laod more');
        },
        tabs: {
          count: post.currentVote,
          upCount,
          downCount,
          activeTabId: popupActiveTabId,
          onClickTab: (tabId) => {
            setPopupActiveTabId(tabId);
          },
        },
      }}
    />
  );
};

PostVotingWrapper.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default memo(PostVotingWrapper);
