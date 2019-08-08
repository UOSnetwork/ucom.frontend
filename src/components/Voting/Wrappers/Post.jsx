import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo, useState, useCallback } from 'react';
import Votin from '../index';
import { selectOwner, selectPostById, selectUsersByIds } from '../../../store/selectors';
import { authShowPopup } from '../../../actions/auth';
import { vote } from '../../../actions/posts';
import { getVotesForPost, getVotesForPostPreview } from '../../../actions/voting';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import { formatRate } from '../../../utils/rate';
import withLoader from '../../../utils/withLoader';
import { TAB_ID_ALL, TAB_ID_UP, TAB_ID_DOWN } from '../UsersPopup/Tabs';
import urls from '../../../utils/urls';
import { getUserName } from '../../../utils/user';
import { INTERACTION_TYPE_ID_VOTING_DOWNVOTE, INTERACTION_TYPE_ID_VOTING_UPVOTE } from '../../../utils/constants';

const interactionTypesByTabId = {
  [TAB_ID_ALL]: null,
  [TAB_ID_UP]: INTERACTION_TYPE_ID_VOTING_UPVOTE,
  [TAB_ID_DOWN]: INTERACTION_TYPE_ID_VOTING_DOWNVOTE,
};

const PostVotingWrapper = ({ postId }) => {
  const dispatch = useDispatch();
  const [upCount, setUpCount] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [detailsUpUserIds, setDetailsUpUserIds] = useState([]);
  const [detailsDownUserIds, setDetailsDownUserIds] = useState([]);
  const [popupActiveTabId, setPopupActiveTabId] = useState(TAB_ID_ALL);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupUsersIds, setPopupUsersIds] = useState([]);
  const [popupUsersMetadata, setPopupUsersMetadata] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [popupUsersLoading, setPopupUsersLoading] = useState(false);

  const post = useSelector(selectPostById(postId), isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const users = useSelector(selectUsersByIds(popupUsersIds), isEqual);
  const detailsUpUsers = useSelector(selectUsersByIds(detailsUpUserIds), isEqual);
  const detailsDownUsers = useSelector(selectUsersByIds(detailsDownUserIds), isEqual);

  const getDataForPreview = useCallback(async () => {
    setDetailsLoading(true);
    try {
      const { downvotes, upvotes } = await withLoader(dispatch(getVotesForPostPreview(postId)));
      setUpCount(upvotes.metadata.totalAmount);
      setDownCount(downvotes.metadata.totalAmount);
      setDetailsUpUserIds(upvotes.data.map(i => i.id));
      setDetailsDownUserIds(downvotes.data.map(i => i.id));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setDetailsLoading(false);
  }, []);

  const getDataForPopup = useCallback(async (interactionType) => {
    setPopupUsersLoading(true);
    setPopupUsersIds([]);
    try {
      const { data, metadata } = await withLoader(dispatch(getVotesForPost(postId, interactionType)));
      setPopupUsersIds(data.map(i => i.id));
      setPopupUsersMetadata(metadata);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setPopupUsersLoading(false);
  }, []);

  const getMoreDataForUpList = useCallback(async (interactionType, page) => {
    setPopupUsersLoading(true);
    try {
      const { data, metadata } = await withLoader(dispatch(getVotesForPost(postId, interactionType, page)));
      setPopupUsersIds(prev => prev.concat(data.map(i => i.id)));
      setPopupUsersMetadata(metadata);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setPopupUsersLoading(false);
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
          userPicks: detailsUpUsers.map(item => ({
            url: urls.getUserUrl(item.id),
            src: urls.getFileUrl(item.avatarFilename),
          })),
          onClickMore: () => {
            setPopupActiveTabId(TAB_ID_UP);
            getDataForPopup(INTERACTION_TYPE_ID_VOTING_UPVOTE);
            setPopupVisible(true);
          },
        },
        downUserPicks: {
          userPicks: detailsDownUsers.map(item => ({
            url: urls.getUserUrl(item.id),
            src: urls.getFileUrl(item.avatarFilename),
          })),
          onClickMore: () => {
            setPopupActiveTabId(TAB_ID_DOWN);
            getDataForPopup(INTERACTION_TYPE_ID_VOTING_DOWNVOTE);
            setPopupVisible(true);
          },
        },
        loading: detailsLoading,
      }}
      usersPopup={{
        users: users.map(item => ({
          id: item.id,
          avatarSrc: urls.getFileUrl(item.avatarFilename),
          url: urls.getUserUrl(item.id),
          title: getUserName(item),
          nickname: item.accountName,
          scaledImportance: item.scaledImportance,
        })),
        visible: popupVisible,
        onClickClose: () => {
          setPopupVisible(false);
        },
        onLoadMore: () => {
          if (!popupUsersLoading && popupUsersMetadata.hasMore) {
            getMoreDataForUpList(interactionTypesByTabId[popupActiveTabId], popupUsersMetadata.page + 1);
          }
        },
        tabs: {
          count: upCount + downCount,
          upCount,
          downCount,
          activeTabId: popupActiveTabId,
          onClickTab: (tabId) => {
            getDataForPopup(interactionTypesByTabId[tabId]);
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
